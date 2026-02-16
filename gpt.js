//GPT esimerkki

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * YATZY – single-file React implementation
 * - Basic + optional categories
 * - 5 dice, up to 2 rerolls (3 total rolls)
 * - Lock dice
 * - Click or keyboard controls
 * - Sound effects (generated via WebAudio; no external assets)
 * - Simple leaderboard (localStorage)
 *
 * Drop this file into a React app and render <YatzyGame />.
 */

// --------------------------- Utilities ---------------------------

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const countBy = (arr) => {
    const m = new Map();
    for (const x of arr) m.set(x, (m.get(x) || 0) + 1);
    return m;
};
const sortedDesc = (arr) => [...arr].sort((a, b) => b - a);

const randDie = () => 1 + Math.floor(Math.random() * 6);
const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

// --------------------------- Audio (no files) ---------------------------

function useSfx() {
    const ctxRef = useRef(null);
    const masterRef = useRef(null);

    const ensure = () => {
        if (typeof window === "undefined") return null;
        if (!ctxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            ctxRef.current = new AudioContext();
            masterRef.current = ctxRef.current.createGain();
            masterRef.current.gain.value = 0.15;
            masterRef.current.connect(ctxRef.current.destination);
        }
        return ctxRef.current;
    };

    const beep = (freq, ms, type = "sine", gain = 0.35) => {
        const ctx = ensure();
        if (!ctx) return;
        const t0 = ctx.currentTime;

        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t0);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms / 1000);

        osc.connect(g);
        g.connect(masterRef.current);

        osc.start(t0);
        osc.stop(t0 + ms / 1000 + 0.02);
    };

    const noise = (ms, gain = 0.25) => {
        const ctx = ensure();
        if (!ctx) return;
        const t0 = ctx.currentTime;

        const bufferSize = Math.floor(ctx.sampleRate * (ms / 1000));
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.8;

        const src = ctx.createBufferSource();
        src.buffer = buffer;

        const biquad = ctx.createBiquadFilter();
        biquad.type = "bandpass";
        biquad.frequency.value = 600;
        biquad.Q.value = 0.7;

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms / 1000);

        src.connect(biquad);
        biquad.connect(g);
        g.connect(masterRef.current);

        src.start(t0);
        src.stop(t0 + ms / 1000 + 0.02);
    };

    return {
        click: () => {
            beep(520, 55, "square", 0.18);
            beep(880, 40, "sine", 0.08);
        },
        roll: () => {
            noise(160, 0.22);
            beep(220, 90, "triangle", 0.08);
        },
        success: () => {
            beep(523.25, 120, "sine", 0.18);
            beep(659.25, 120, "sine", 0.18);
            beep(783.99, 180, "sine", 0.18);
        },
        gameOver: () => {
            beep(392, 140, "sine", 0.14);
            beep(329.63, 140, "sine", 0.14);
            beep(261.63, 220, "sine", 0.14);
        },
        resumeIfSuspended: async () => {
            const ctx = ensure();
            if (ctx && ctx.state === "suspended") await ctx.resume();
        },
    };
}

// --------------------------- Scoring ---------------------------

const CATEGORIES = [
    // Basic
    { key: "ones", label: "Ones", group: "Upper" },
    { key: "twos", label: "Twos", group: "Upper" },
    { key: "threes", label: "Threes", group: "Upper" },
    { key: "fours", label: "Fours", group: "Upper" },
    { key: "fives", label: "Fives", group: "Upper" },
    { key: "sixes", label: "Sixes", group: "Upper" },

    // Optional (lower)
    { key: "pair", label: "Pair", group: "Lower" },
    { key: "twoPair", label: "Two Pair", group: "Lower" },
    { key: "threeKind", label: "3 of a kind", group: "Lower" },
    { key: "fourKind", label: "4 of a kind", group: "Lower" },
    { key: "smallStraight", label: "Small straight", group: "Lower" },
    { key: "largeStraight", label: "Large straight", group: "Lower" },
    { key: "fullHouse", label: "Full house", group: "Lower" },
    { key: "chance", label: "Chance", group: "Lower" },

    // Basic requirement
    { key: "yatzy", label: "Yatzy", group: "Lower" },
];

function scoreCategory(key, dice) {
    const counts = countBy(dice);
    const entries = [...counts.entries()].sort((a, b) => b[0] - a[0]); // by face desc
    const byCountDesc = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
    const faces = [...counts.keys()].sort((a, b) => a - b);

    const upper = (n) => dice.filter((d) => d === n).length * n;

    switch (key) {
        case "ones":
            return upper(1);
        case "twos":
            return upper(2);
        case "threes":
            return upper(3);
        case "fours":
            return upper(4);
        case "fives":
            return upper(5);
        case "sixes":
            return upper(6);

        case "pair": {
            const pairs = entries.filter(([face, c]) => c >= 2).map(([f]) => f);
            return pairs.length ? Math.max(...pairs) * 2 : 0;
        }

        case "twoPair": {
            const pairs = entries.filter(([face, c]) => c >= 2).map(([f]) => f).sort((a, b) => b - a);
            if (pairs.length >= 2) return pairs[0] * 2 + pairs[1] * 2;
            return 0;
        }

        case "threeKind": {
            const threes = entries.filter(([face, c]) => c >= 3).map(([f]) => f);
            return threes.length ? Math.max(...threes) * 3 : 0;
        }

        case "fourKind": {
            const fours = entries.filter(([face, c]) => c >= 4).map(([f]) => f);
            return fours.length ? Math.max(...fours) * 4 : 0;
        }

        case "smallStraight": {
            // 1-2-3-4-5
            const need = [1, 2, 3, 4, 5];
            return need.every((n) => counts.has(n)) ? 15 : 0;
        }

        case "largeStraight": {
            // 2-3-4-5-6
            const need = [2, 3, 4, 5, 6];
            return need.every((n) => counts.has(n)) ? 20 : 0;
        }

        case "fullHouse": {
            // 3 + 2
            const has3 = byCountDesc.find(([, c]) => c === 3);
            const has2 = byCountDesc.find(([, c]) => c === 2);
            if (has3 && has2) return has3[0] * 3 + has2[0] * 2;
            return 0;
        }

        case "chance":
            return sum(dice);

        case "yatzy": {
            const maxCount = Math.max(...[...counts.values()]);
            return maxCount === 5 ? 50 : 0;
        }

        default:
            return 0;
    }
}

// --------------------------- Storage ---------------------------

const LS_KEY_LEADERBOARD = "yatzy_leaderboard_v1";

function loadLeaderboard() {
    try {
        const raw = localStorage.getItem(LS_KEY_LEADERBOARD);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

function saveLeaderboard(entries) {
    try {
        localStorage.setItem(LS_KEY_LEADERBOARD, JSON.stringify(entries.slice(0, 20)));
    } catch {
        // ignore
    }
}

// --------------------------- UI components ---------------------------

function DiceFace({ value }) {
    // simple pip layout
    const pip = "w-2.5 h-2.5 rounded-full bg-neutral-900";
    const empty = "w-2.5 h-2.5";

    const grid = {
        1: [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0],
        ],
        2: [
            [1, 0, 0],
            [0, 0, 0],
            [0, 0, 1],
        ],
        3: [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ],
        4: [
            [1, 0, 1],
            [0, 0, 0],
            [1, 0, 1],
        ],
        5: [
            [1, 0, 1],
            [0, 1, 0],
            [1, 0, 1],
        ],
        6: [
            [1, 0, 1],
            [1, 0, 1],
            [1, 0, 1],
        ],
    }[value];

    return (
        <div className="grid grid-cols-3 gap-2">
            {grid.flat().map((x, i) => (
                <div key={i} className={x ? pip : empty} />
            ))}
        </div>
    );
}

function KbdHint({ children }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-700 shadow-sm">
      {children}
    </span>
    );
}

// --------------------------- Main Game ---------------------------

function createFreshDice() {
    return Array.from({ length: 5 }, () => ({ id: uid(), value: randDie(), locked: false }));
}

function emptyScorecard() {
    const obj = {};
    for (const c of CATEGORIES) obj[c.key] = null; // null = unfilled
    return obj;
}

function calcTotals(scorecard) {
    const upperKeys = ["ones", "twos", "threes", "fours", "fives", "sixes"];
    const upper = sum(upperKeys.map((k) => scorecard[k] ?? 0));
    const upperBonus = upper >= 63 ? 50 : 0;
    const lower = sum(
        CATEGORIES.filter((c) => c.group === "Lower").map((c) => scorecard[c.key] ?? 0)
    );
    const total = upper + upperBonus + lower;
    return { upper, upperBonus, lower, total };
}

function isGameComplete(scorecard) {
    return CATEGORIES.every((c) => scorecard[c.key] !== null);
}

export default function YatzyGame() {
    const sfx = useSfx();

    // players
    const [players, setPlayers] = useState(() => [{ id: uid(), name: "Player 1" }]);
    const [activePlayerIdx, setActivePlayerIdx] = useState(0);

    // game state per player
    const [scorecards, setScorecards] = useState(() => ({ [players[0].id]: emptyScorecard() }));

    // dice/turn state
    const [dice, setDice] = useState(() => createFreshDice());
    const [rollsUsed, setRollsUsed] = useState(0); // 0..3 (3 max)
    const [turnStarted, setTurnStarted] = useState(false);
    const [isRolling, setIsRolling] = useState(false);

    // ui
    const [focusArea, setFocusArea] = useState("dice"); // dice | score
    const [focusedDie, setFocusedDie] = useState(0);
    const [focusedCategoryIdx, setFocusedCategoryIdx] = useState(0);

    // leaderboard
    const [leaderboard, setLeaderboard] = useState(() => (typeof window !== "undefined" ? loadLeaderboard() : []));

    const activePlayer = players[activePlayerIdx];
    const scorecard = scorecards[activePlayer.id] || emptyScorecard();

    const previewScores = useMemo(() => {
        const values = dice.map((d) => d.value);
        const out = {};
        for (const c of CATEGORIES) {
            out[c.key] = scorecard[c.key] === null ? scoreCategory(c.key, values) : scorecard[c.key];
        }
        return out;
    }, [dice, scorecard]);

    const totals = useMemo(() => calcTotals(scorecard), [scorecard]);

    const rollsLeft = 3 - rollsUsed;

    // --------------------------- Core actions ---------------------------

    const newGame = async () => {
        await sfx.resumeIfSuspended();
        sfx.click();

        const newPlayers = players.length ? players : [{ id: uid(), name: "Player 1" }];

        const newScorecards = {};
        for (const p of newPlayers) newScorecards[p.id] = emptyScorecard();

        setScorecards(newScorecards);
        setActivePlayerIdx(0);
        setDice(createFreshDice());
        setRollsUsed(0);
        setTurnStarted(false);
        setIsRolling(false);
        setFocusArea("dice");
        setFocusedDie(0);
        setFocusedCategoryIdx(0);
    };

    const endGame = async () => {
        await sfx.resumeIfSuspended();
        sfx.gameOver();

        // store scores for all players that have any filled category
        const entries = [...leaderboard];
        const now = new Date().toISOString();

        for (const p of players) {
            const sc = scorecards[p.id] || emptyScorecard();
            const any = CATEGORIES.some((c) => sc[c.key] !== null);
            if (!any) continue;
            const t = calcTotals(sc).total;
            entries.unshift({ id: uid(), name: p.name || "Player", score: t, date: now });
        }

        const sorted = entries.sort((a, b) => b.score - a.score).slice(0, 20);
        setLeaderboard(sorted);
        saveLeaderboard(sorted);

        // reset current game state but keep players
        setScorecards((prev) => {
            const next = { ...prev };
            for (const p of players) next[p.id] = emptyScorecard();
            return next;
        });

        setActivePlayerIdx(0);
        setDice(createFreshDice());
        setRollsUsed(0);
        setTurnStarted(false);
        setIsRolling(false);
        setFocusArea("dice");
        setFocusedDie(0);
        setFocusedCategoryIdx(0);
    };

    const rollDice = async () => {
        await sfx.resumeIfSuspended();
        if (isRolling) return;
        if (rollsUsed >= 3) return;

        // start of turn: allow roll even if all dice locked (we'll roll none)
        sfx.roll();
        setIsRolling(true);

        // animate delay
        await new Promise((r) => setTimeout(r, 450));

        setDice((prev) =>
            prev.map((d) => {
                if (d.locked && turnStarted) return d;
                // first roll always rolls all dice
                if (!turnStarted) return { ...d, value: randDie(), locked: false };
                return { ...d, value: randDie() };
            })
        );

        setRollsUsed((n) => n + 1);
        setTurnStarted(true);

        await new Promise((r) => setTimeout(r, 120));
        setIsRolling(false);
    };

    const toggleLockDie = async (idx) => {
        await sfx.resumeIfSuspended();
        if (!turnStarted) return; // only lock after first roll
        if (isRolling) return;
        sfx.click();

        setDice((prev) => prev.map((d, i) => (i === idx ? { ...d, locked: !d.locked } : d)));
    };

    const canRecord = turnStarted && rollsUsed > 0 && !isRolling;

    const recordCategory = async (catKey) => {
        await sfx.resumeIfSuspended();
        if (!canRecord) return;
        if (scorecard[catKey] !== null) return;

        const values = dice.map((d) => d.value);
        const pts = scoreCategory(catKey, values);

        sfx.success();

        setScorecards((prev) => {
            const next = { ...prev };
            const sc = { ...(next[activePlayer.id] || emptyScorecard()) };
            sc[catKey] = pts;
            next[activePlayer.id] = sc;
            return next;
        });

        // next player / next turn
        const nextIdx = (activePlayerIdx + 1) % players.length;

        // reset turn
        setDice(createFreshDice());
        setRollsUsed(0);
        setTurnStarted(false);
        setIsRolling(false);

        // switch player
        setActivePlayerIdx(nextIdx);
        setFocusArea("dice");
        setFocusedDie(0);

        // game complete for everyone?
        const willBeComplete = (() => {
            // check using optimistic update
            const temp = { ...scorecards };
            const sc = { ...(temp[activePlayer.id] || emptyScorecard()) };
            sc[catKey] = pts;
            temp[activePlayer.id] = sc;
            return players.every((p) => isGameComplete(temp[p.id] || emptyScorecard()));
        })();

        if (willBeComplete) {
            // end game and store
            setTimeout(() => {
                endGame();
            }, 250);
        }
    };

    // --------------------------- Keyboard controls ---------------------------

    useEffect(() => {
        const onKeyDown = (e) => {
            // prevent scrolling
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
                e.preventDefault();
            }

            if (e.key === "Tab") {
                e.preventDefault();
                setFocusArea((a) => (a === "dice" ? "score" : "dice"));
                return;
            }

            // global shortcuts
            if (e.key.toLowerCase() === "n") {
                newGame();
                return;
            }
            if (e.key.toLowerCase() === "e") {
                endGame();
                return;
            }

            if (focusArea === "dice") {
                if (e.key === "ArrowLeft") setFocusedDie((i) => clamp(i - 1, 0, 4));
                if (e.key === "ArrowRight") setFocusedDie((i) => clamp(i + 1, 0, 4));

                if (e.key === "ArrowDown") setFocusArea("score");

                if (e.key === "Enter" || e.key === " ") {
                    // If turn started -> lock/unlock focused die
                    if (turnStarted) toggleLockDie(focusedDie);
                    else rollDice();
                }

                if (e.key.toLowerCase() === "r") rollDice();
            }

            if (focusArea === "score") {
                const max = CATEGORIES.length - 1;
                if (e.key === "ArrowUp") setFocusedCategoryIdx((i) => clamp(i - 1, 0, max));
                if (e.key === "ArrowDown") setFocusedCategoryIdx((i) => clamp(i + 1, 0, max));
                if (e.key === "ArrowLeft") setFocusArea("dice");

                if (e.key === "Enter" || e.key === " ") {
                    const cat = CATEGORIES[focusedCategoryIdx];
                    if (cat) recordCategory(cat.key);
                }
            }
        };

        window.addEventListener("keydown", onKeyDown, { passive: false });
        return () => window.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusArea, focusedDie, focusedCategoryIdx, turnStarted, rollsUsed, isRolling, scorecard, activePlayerIdx, players, scorecards]);

    // --------------------------- Players ---------------------------

    const addPlayer = async () => {
        await sfx.resumeIfSuspended();
        sfx.click();

        setPlayers((prev) => {
            const next = [...prev, { id: uid(), name: `Player ${prev.length + 1}` }];
            return next;
        });

        setScorecards((prev) => {
            const next = { ...prev };
            const id = uid();
            // NOTE: we need to keep id stable; create in one place
            return next;
        });
    };

    // Fix scorecard creation when players change
    useEffect(() => {
        setScorecards((prev) => {
            const next = { ...prev };
            for (const p of players) {
                if (!next[p.id]) next[p.id] = emptyScorecard();
            }
            // remove scorecards for removed players
            for (const id of Object.keys(next)) {
                if (!players.some((p) => p.id === id)) delete next[id];
            }
            return next;
        });
    }, [players]);

    const updatePlayerName = (playerId, name) => {
        setPlayers((prev) => prev.map((p) => (p.id === playerId ? { ...p, name } : p)));
    };

    const removePlayer = async (playerId) => {
        await sfx.resumeIfSuspended();
        sfx.click();

        setPlayers((prev) => {
            if (prev.length <= 1) return prev;
            const next = prev.filter((p) => p.id !== playerId);
            return next.length ? next : prev;
        });

        setActivePlayerIdx((i) => {
            const idx = players.findIndex((p) => p.id === playerId);
            if (idx === -1) return i;
            return clamp(i, 0, Math.max(0, players.length - 2));
        });
    };

    // --------------------------- Render helpers ---------------------------

    const scoreRows = CATEGORIES.map((c, idx) => {
        const filled = scorecard[c.key] !== null;
        const value = filled ? scorecard[c.key] : previewScores[c.key];
        const isFocused = focusArea === "score" && focusedCategoryIdx === idx;

        return (
            <motion.button
                key={c.key}
                onMouseEnter={() => {
                    setFocusArea("score");
                    setFocusedCategoryIdx(idx);
                }}
                onClick={() => recordCategory(c.key)}
                disabled={!canRecord || filled}
                whileHover={{ scale: filled ? 1 : 1.01 }}
                whileTap={{ scale: filled ? 1 : 0.99 }}
                className={
                    "w-full rounded-2xl border px-4 py-3 text-left transition shadow-sm focus:outline-none " +
                    (filled
                        ? "border-neutral-200 bg-neutral-50 text-neutral-500"
                        : "border-neutral-200 bg-white hover:border-neutral-300") +
                    (isFocused ? " ring-2 ring-neutral-900" : "")
                }
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="truncate text-sm font-semibold text-neutral-900">{c.label}</div>
                            <div className="text-xs text-neutral-500">{c.group}</div>
                            {filled && (
                                <span className="ml-1 rounded-full bg-neutral-900 px-2 py-0.5 text-[11px] font-medium text-white">
                  Locked
                </span>
                            )}
                        </div>
                        {!filled && (
                            <div className="mt-1 text-xs text-neutral-500">Click / Enter to record</div>
                        )}
                    </div>

                    <div className="shrink-0 text-right">
                        <div className={"text-lg font-bold " + (filled ? "text-neutral-700" : "text-neutral-900")}>{value}</div>
                        {!filled && <div className="text-[11px] text-neutral-500">preview</div>}
                    </div>
                </div>
            </motion.button>
        );
    });

    const activeTurnLabel = useMemo(() => {
        if (!turnStarted) return "Roll to start your turn";
        if (rollsUsed >= 3) return "No rerolls left — pick a category";
        return `Rerolls left: ${rollsLeft}`;
    }, [turnStarted, rollsUsed, rollsLeft]);

    // --------------------------- UI ---------------------------

    return (
        <div className="min-h-screen w-full bg-neutral-50 text-neutral-900">
            <div className="mx-auto max-w-6xl px-4 py-6">
                <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-3xl font-extrabold tracking-tight">Yatzy</div>
                        <div className="mt-1 text-sm text-neutral-600">
                            Mouse + keyboard. <KbdHint>Tab</KbdHint> switches focus. <KbdHint>R</KbdHint> roll.
                            <KbdHint>N</KbdHint> new. <KbdHint>E</KbdHint> end.
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={newGame}
                            className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                        >
                            New game
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={endGame}
                            className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm"
                        >
                            End game
                        </motion.button>
                    </div>
                </header>

                <main className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
                    {/* Left: Dice + controls */}
                    <section className="lg:col-span-7">
                        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-neutral-900">Current player</div>
                                    <div className="mt-0.5 text-xl font-extrabold tracking-tight">{activePlayer?.name}</div>
                                    <div className="mt-1 text-sm text-neutral-600">{activeTurnLabel}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={rollDice}
                                        disabled={isRolling || rollsUsed >= 3}
                                        className={
                                            "rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition " +
                                            (isRolling || rollsUsed >= 3
                                                ? "bg-neutral-200 text-neutral-500"
                                                : "bg-neutral-900 text-white")
                                        }
                                    >
                                        {turnStarted ? "Roll" : "Start (roll)"}
                                    </motion.button>

                                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-semibold text-neutral-800">
                                        Rolls: {rollsUsed}/3
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-5 gap-3">
                                {dice.map((d, idx) => {
                                    const focused = focusArea === "dice" && focusedDie === idx;
                                    return (
                                        <motion.button
                                            key={d.id}
                                            onMouseEnter={() => {
                                                setFocusArea("dice");
                                                setFocusedDie(idx);
                                            }}
                                            onClick={() => toggleLockDie(idx)}
                                            disabled={!turnStarted || isRolling}
                                            whileHover={{ scale: !turnStarted ? 1 : 1.03 }}
                                            whileTap={{ scale: !turnStarted ? 1 : 0.98 }}
                                            animate={
                                                isRolling && (!d.locked || !turnStarted)
                                                    ? { rotate: [0, 12, -12, 10, -10, 0], y: [0, -6, 0] }
                                                    : { rotate: 0, y: 0 }
                                            }
                                            transition={{ duration: 0.45 }}
                                            className={
                                                "relative rounded-3xl border p-3 shadow-sm transition focus:outline-none " +
                                                (d.locked
                                                    ? "border-neutral-900 bg-neutral-100"
                                                    : "border-neutral-200 bg-white hover:border-neutral-300") +
                                                (focused ? " ring-2 ring-neutral-900" : "")
                                            }
                                            aria-label={`Die ${idx + 1} value ${d.value}${d.locked ? " locked" : ""}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs font-semibold text-neutral-500">{idx + 1}</div>
                                                {turnStarted && (
                                                    <div
                                                        className={
                                                            "text-[11px] font-semibold " +
                                                            (d.locked ? "text-neutral-900" : "text-neutral-400")
                                                        }
                                                    >
                                                        {d.locked ? "LOCK" : ""}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-3 flex items-center justify-center">
                                                <DiceFace value={d.value} />
                                            </div>
                                            {!turnStarted && (
                                                <div className="mt-3 text-center text-[11px] text-neutral-400">roll first</div>
                                            )}
                                            {turnStarted && (
                                                <div className="mt-3 text-center text-[11px] text-neutral-500">
                                                    {d.locked ? "kept" : "click to keep"}
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                                <KbdHint>Tab</KbdHint> focus
                                <KbdHint>←</KbdHint>
                                <KbdHint>→</KbdHint> select die
                                <KbdHint>Enter</KbdHint> lock die
                                <KbdHint>R</KbdHint> roll
                            </div>
                        </div>

                        {/* Players */}
                        <div className="mt-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold">Players</div>
                                    <div className="mt-1 text-sm text-neutral-600">Names are saved for this session.</div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={async () => {
                                        await sfx.resumeIfSuspended();
                                        sfx.click();
                                        setPlayers((prev) => {
                                            const p = { id: uid(), name: `Player ${prev.length + 1}` };
                                            return [...prev, p];
                                        });
                                    }}
                                    className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm"
                                >
                                    Add player
                                </motion.button>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                {players.map((p, idx) => {
                                    const isActive = idx === activePlayerIdx;
                                    const sc = scorecards[p.id] || emptyScorecard();
                                    const t = calcTotals(sc);

                                    return (
                                        <div
                                            key={p.id}
                                            className={
                                                "rounded-2xl border p-4 shadow-sm " +
                                                (isActive ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white")
                                            }
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs font-semibold text-neutral-500">Player {idx + 1}</div>
                                                    <input
                                                        value={p.name}
                                                        onChange={(e) => updatePlayerName(p.id, e.target.value)}
                                                        className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-neutral-900"
                                                    />
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <div className="text-xs text-neutral-500">Total</div>
                                                    <div className="text-xl font-extrabold">{t.total}</div>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="text-xs text-neutral-600">
                                                    Filled: {CATEGORIES.filter((c) => sc[c.key] !== null).length}/{CATEGORIES.length}
                                                </div>
                                                <button
                                                    onClick={() => removePlayer(p.id)}
                                                    disabled={players.length <= 1}
                                                    className={
                                                        "rounded-xl px-3 py-1.5 text-xs font-semibold transition " +
                                                        (players.length <= 1
                                                            ? "bg-neutral-200 text-neutral-500"
                                                            : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200")
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Right: Scorecard */}
                    <section className="lg:col-span-5">
                        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold">Scorecard</div>
                                    <div className="mt-1 text-sm text-neutral-600">
                                        Select a category to record points.
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-xs text-neutral-500">Total</div>
                                    <div className="text-2xl font-extrabold">{totals.total}</div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-2">{scoreRows}</div>

                            <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="font-semibold">Upper</div>
                                    <div className="font-bold">{totals.upper}</div>
                                </div>
                                <div className="mt-2 flex items-center justify-between text-sm">
                                    <div className="font-semibold">Bonus (63+)</div>
                                    <div className="font-bold">{totals.upperBonus}</div>
                                </div>
                                <div className="mt-2 flex items-center justify-between text-sm">
                                    <div className="font-semibold">Lower</div>
                                    <div className="font-bold">{totals.lower}</div>
                                </div>
                                <div className="mt-3 h-px bg-neutral-200" />
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="text-sm font-extrabold">Total</div>
                                    <div className="text-lg font-extrabold">{totals.total}</div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                                <KbdHint>Tab</KbdHint> focus
                                <KbdHint>↑</KbdHint>
                                <KbdHint>↓</KbdHint> select category
                                <KbdHint>Enter</KbdHint> record
                            </div>
                        </div>

                        {/* Leaderboard */}
                        <div className="mt-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold">Leaderboard</div>
                                    <div className="mt-1 text-sm text-neutral-600">Saved in localStorage.</div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={async () => {
                                        await sfx.resumeIfSuspended();
                                        sfx.click();
                                        setLeaderboard([]);
                                        saveLeaderboard([]);
                                    }}
                                    className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm"
                                >
                                    Clear
                                </motion.button>
                            </div>

                            <div className="mt-4">
                                {leaderboard.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
                                        No scores yet. Finish or end a game to save scores.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {leaderboard.slice(0, 10).map((e, i) => (
                                            <div
                                                key={e.id}
                                                className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3"
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-extrabold">#{i + 1}</div>
                                                        <div className="truncate text-sm font-semibold">{e.name}</div>
                                                    </div>
                                                    <div className="mt-0.5 text-xs text-neutral-500">
                                                        {new Date(e.date).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="text-lg font-extrabold">{e.score}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="mt-6 text-center text-xs text-neutral-500">
                    Built with React + Framer Motion. Sounds are generated with WebAudio.
                </footer>
            </div>
        </div>
    );
}