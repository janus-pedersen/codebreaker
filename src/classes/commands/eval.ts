import { CommandManager } from './../CommandManager';
import { StringInput } from './../inputs/StringInput';
import { Command } from "../Command";
import Evaluator from 'math-expression-evaluator'

const mexp = new Evaluator()

export const evalCmd = new Command('eval')
	.addInput(new StringInput('math', 'The math to evaluate', true))
	.setDescription('Evaluates a math expression')
	.onExec((system, math) => {
		const lexed = mexp.lex(math!, []);
		const parsed = mexp.toPostfix(lexed);
		const result = mexp.postfixEval(parsed, {});

		system.terminal.basic(result.toString(), false);
	});

CommandManager.addDefaultCommand(evalCmd);
