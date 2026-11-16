# Answer text — task 3.1

**Question.** Does the navigator's `AnswerShown` text hold every text block of a turn, or only the last?

**Answer.** Only the turn's last assistant message. An earlier text block, written before a tool call,
is not in it.

**Source.** The mod API type file the engine ships (Claude Code build 2.1.325): `TurnCompleteFields.answer`
is "The assistant's final visible text this turn", and the input is "the assistant's final message of a
turn". Read from the type contract; not an observed turn.

**Consequence (D-9, RISK-6).** A mark written at the start of a turn that then dispatches a worker is
invisible to the navigator at `TurnEnded`. The rule therefore asks for the mark in the turn's last
message too, when that turn dispatches a worker.
