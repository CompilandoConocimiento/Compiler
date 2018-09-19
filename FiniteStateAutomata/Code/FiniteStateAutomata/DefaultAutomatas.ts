import {FiniteStateAutomata} from "./FiniteStateAutomata"
import {CFG} from "./CFG"
import {token} from "./Types"



const plusSign = FiniteStateAutomata.basicFSA('+');
plusSign.setName("Plus sign");
plusSign.setFinalToken(token.PlusSign);

const minusSign = FiniteStateAutomata.basicFSA('-');
minusSign.setName("Minus sign");
minusSign.setFinalToken(token.MinusSign);

const multSign = FiniteStateAutomata.basicFSA('*');
multSign.setName("Multiplication sign");
multSign.setFinalToken(token.MultiplicationSign);

const divSign = FiniteStateAutomata.basicFSA('/');
divSign.setName("Division sign");
divSign.setFinalToken(token.DivisionSign);

const openParenthesis = FiniteStateAutomata.basicFSA('(');
openParenthesis.setName("Opening parenthesis");
openParenthesis.setFinalToken(token.OpenParenthesis);

const closeParenthesis = FiniteStateAutomata.basicFSA(')');
closeParenthesis.setName("Closing parenthesis");
closeParenthesis.setFinalToken(token.CloseParenthesis);

const integer = FiniteStateAutomata.basicFSA('d');
integer.positiveClosure();
integer.setName("Integer");

const decimal = integer.clone();
decimal.concat(FiniteStateAutomata.basicFSA('.'));
decimal.concat(integer.clone());
decimal.setName("Decimal");

const exponent = FiniteStateAutomata.basicFSA('E').join(FiniteStateAutomata.basicFSA('e'));
exponent.concat(plusSign.clone().join(minusSign.clone()).optionalClosure().concat(integer.clone()));

const float = decimal.clone().concat(exponent.clone());
float.setName("Float");

const number = FiniteStateAutomata.superJoin([integer.clone(), decimal.clone(), float.clone()]);
number.setName("Number");
number.setFinalToken(token.Number);

const arithmetic = FiniteStateAutomata.superJoin(
    [   
        plusSign.clone(), 
        minusSign.clone(), 
        multSign.clone(),
        divSign.clone(),
        openParenthesis.clone(),
        closeParenthesis.clone(),
        number.clone()
    ]
);

arithmetic.setName("Arithmetic expressions")


const grammar1: CFG = new CFG(new Set([1, 2, 3, 4, 5, 6, 10]), new Set(['E', 'T', 'F']), 'E');
grammar1.addRule('E', ['E', 1, 'T']);
grammar1.addRule('E', ['E', 2, 'T']);
grammar1.addRule('E', ['T']);
grammar1.addRule('T', ['T', 3, 'F']);
grammar1.addRule('T', ['T', 4, 'F']);
grammar1.addRule('T', ['F']);
grammar1.addRule('F', [5, 'E', 6]);
grammar1.addRule('F', [10]);
window["grammar1"] = grammar1

const grammar2: CFG = new CFG(new Set([1, 2, 3, 4, 5, 6, 10]), new Set(['E']), 'E');
grammar2.addRule('E', ['E', 1, 'E']);
grammar2.addRule('E', ['E', 2, 'E']);
grammar2.addRule('E', ['E', 3, 'E']);
grammar2.addRule('E', ['E', 4, 'E']);
grammar2.addRule('E', [5, 'E', 6]);
grammar2.addRule('E', [10]);
window["grammar2"] = grammar2

const grammar3: CFG = new CFG(new Set([1, 2, 3, 4, 5, 6, 10]), new Set(['E', 'T', 'F', 'e', 't']), 'E');
grammar3.addRule('E', ['T', 'e']);
grammar3.addRule('e', [1, 'T', 'e']);
grammar3.addRule('e', [2, 'T', 'e']);
grammar3.addRule('e', []);
grammar3.addRule('T', ['F', 't']);
grammar3.addRule('t', [3, 'F', 't']);
grammar3.addRule('t', [4, 'F', 't']);
grammar3.addRule('t', []);
grammar3.addRule('F', [5, 'E', 6]);
grammar3.addRule('F', [10]);
window["grammar3"] = grammar3








const DefaultaritmeticAutomatas: Array<FiniteStateAutomata> = [
    plusSign, minusSign, multSign, divSign, openParenthesis, closeParenthesis,
    integer, decimal, float, number, arithmetic
]








const a = FiniteStateAutomata.basicFSA('a');
a.setName("a");

const b = FiniteStateAutomata.basicFSA('b');
b.setName("b");

const c = FiniteStateAutomata.basicFSA('c');
c.setName("c");

const d = FiniteStateAutomata.basicFSA('d');
d.setName("d");

const s = FiniteStateAutomata.basicFSA('s');
s.setName("s");

const t = FiniteStateAutomata.basicFSA('t');
t.setName("t");

const firstAuto = a.clone().join(b.clone()).positiveClosure().concat(c.clone().kleeneClosure()).concat(d.clone())
firstAuto.setFinalToken(100)

const secondAuto = c.clone().concat(a.clone().join(b.clone()).positiveClosure())
secondAuto.setFinalToken(200)

const thirdAuto = a.clone().concat(b.clone()).concat(c.clone().positiveClosure()).concat(b.clone().kleeneClosure()).concat(a.clone().positiveClosure()).concat(d.clone().positiveClosure())
thirdAuto.setFinalToken(300)

const fourthAuto = s.clone().join(t.clone()).positiveClosure()
fourthAuto.setFinalToken(400)

window["testString"] = "abbacccdsstscababbssabcccaaddabccaddsstss"


const DefaultTestAutomatas: Array<FiniteStateAutomata> = [
    firstAuto, secondAuto, thirdAuto, fourthAuto, FiniteStateAutomata.superJoin([firstAuto.clone(), secondAuto.clone(), thirdAuto.clone(), fourthAuto.clone()]) 
]


export default DefaultTestAutomatas