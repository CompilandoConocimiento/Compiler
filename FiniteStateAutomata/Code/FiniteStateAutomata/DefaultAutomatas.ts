import {FiniteStateAutomata} from "./FiniteStateAutomata"
import {CFG} from "./CFG"
import {token} from "./Types"
import { metaCharacters } from "./State";

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

const powSign = FiniteStateAutomata.basicFSA('^');
powSign.setName("Power sign");
powSign.setFinalToken(token.PowerSign);

const piConstant = FiniteStateAutomata.basicFSA('pi');
piConstant.setName("Pi Constant");
piConstant.setFinalToken(token.PiConstant);

const eConstant = FiniteStateAutomata.basicFSA('e');
eConstant.setName("Euler Constant");
eConstant.setFinalToken(token.EConstant);

const sineFunc = FiniteStateAutomata.basicFSA('sin');
sineFunc.setName("Sine function");
sineFunc.setFinalToken(token.Sine);

const cosineFunc = FiniteStateAutomata.basicFSA('cos');
cosineFunc.setName("Cosine function");
cosineFunc.setFinalToken(token.Cosine);

const tangentFunc = FiniteStateAutomata.basicFSA('tan');
tangentFunc.setName("Tangent function");
tangentFunc.setFinalToken(token.Tangent);

const arcSineFunc = FiniteStateAutomata.basicFSA('arcsin');
arcSineFunc.setName("Inverse sine function");
arcSineFunc.setFinalToken(token.ArcSin);

const arcCosineFunc = FiniteStateAutomata.basicFSA('arccos');
arcCosineFunc.setName("Inverse cosine function");
arcCosineFunc.setFinalToken(token.ArcCos);

const arcTangentFunc = FiniteStateAutomata.basicFSA('arctan');
arcTangentFunc.setName("Inverse tangent function");
arcTangentFunc.setFinalToken(token.ArcTan);

const logFunc = FiniteStateAutomata.basicFSA('log');
logFunc.setName("Logarithm base 10 function");
logFunc.setFinalToken(token.Log);

const lnFunc = FiniteStateAutomata.basicFSA('ln');
lnFunc.setName("Natural logarithm function");
lnFunc.setFinalToken(token.Ln);

const sqrtFunc = FiniteStateAutomata.basicFSA('sqrt');
sqrtFunc.setName("Square root function");
sqrtFunc.setFinalToken(token.Sqrt);

const absFunc = FiniteStateAutomata.basicFSA('abs');
absFunc.setName("Absolute value function");
absFunc.setFinalToken(token.Abs);

const openParenthesis = FiniteStateAutomata.basicFSA('(');
openParenthesis.setName("Opening parenthesis");
openParenthesis.setFinalToken(token.OpenParenthesis);

const closeParenthesis = FiniteStateAutomata.basicFSA(')');
closeParenthesis.setName("Closing parenthesis");
closeParenthesis.setFinalToken(token.CloseParenthesis);

const integer = FiniteStateAutomata.basicFSA('\\d');
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
        powSign.clone(),
        piConstant.clone(),
        eConstant.clone(),
        sineFunc.clone(),
        cosineFunc.clone(),
        tangentFunc.clone(),
        arcSineFunc.clone(),
        arcCosineFunc.clone(),
        arcTangentFunc.clone(),
        logFunc.clone(),
        lnFunc.clone(),
        sqrtFunc.clone(),
        absFunc.clone(),
        openParenthesis.clone(),
        closeParenthesis.clone(),
        number.clone()
    ]
);
arithmetic.setName("Arithmetic expressions")

const arithGrammar: CFG = new CFG(new Set([1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]), new Set(['E', 'T', 'P', 'U', 'F']), 'E', arithmetic);
arithGrammar.addRule('E', ['E', token.PlusSign, 'T'], function(args){return args[0]+args[2];});
arithGrammar.addRule('E', ['E', token.MinusSign, 'T'], function(args){return args[0]-args[2];});
arithGrammar.addRule('E', ['T'], function(args){return args[0];});

arithGrammar.addRule('T', ['T', token.MultiplicationSign, 'P'], function(args){return args[0]*args[2];});
arithGrammar.addRule('T', ['T', token.DivisionSign, 'P'], function(args){return args[0]/args[2];});
arithGrammar.addRule('T', ['P'], function(args){return args[0];});

arithGrammar.addRule('P', ['U', token.PowerSign, 'P'], function(args){return Math.pow(args[0],args[2]);});
arithGrammar.addRule('P', ['U'], function(args){return args[0];});

arithGrammar.addRule('U', [token.PlusSign, 'U'], function(args){return args[1];});
arithGrammar.addRule('U', [token.MinusSign, 'U'], function(args){return -args[1];});
arithGrammar.addRule('U', ['F'], function(args){return args[0];});

arithGrammar.addRule('F', [token.Number], function(args){return Number(args[0]);});
arithGrammar.addRule('F', [token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return args[1];});
arithGrammar.addRule('F', [token.Sine, token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return Math.sin(args[2]);});
arithGrammar.addRule('F', [token.Cosine, token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return Math.cos(args[2]);});
arithGrammar.addRule('F', [token.Tangent, token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return Math.tan(args[2]);});
arithGrammar.addRule('F', [token.ArcSin, token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return Math.asin(args[2]);});
arithGrammar.addRule('F', [token.ArcCos, token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return Math.acos(args[2]);});
arithGrammar.addRule('F', [token.ArcTan, token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return Math.atan(args[2]);});
arithGrammar.addRule('F', [token.Log, token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return Math.log10(args[2]);});
arithGrammar.addRule('F', [token.Ln, token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return Math.log(args[2]);});
arithGrammar.addRule('F', [token.Sqrt, token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return Math.sqrt(args[2]);});
arithGrammar.addRule('F', [token.Abs, token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return Math.abs(args[2]);});
arithGrammar.addRule('F', [token.PiConstant], function(){return Math.PI;});
arithGrammar.addRule('F', [token.EConstant], function(){return Math.E;});

arithGrammar.setName("Arithmetic expressions")
window["arithGrammar"] = arithGrammar

console.log(arithGrammar.executeActions(arithGrammar.parseString("(sin(2*pi/7)+sin(4*pi/7)+sin(8*pi/7))^2*4+abs(-1)+3*arcsin(sqrt(3)/2)")))

const DefaultAritmeticAutomatas: Array<FiniteStateAutomata> = [
    plusSign, minusSign, multSign, divSign, powSign,
    piConstant, eConstant,
    sineFunc, cosineFunc, tangentFunc, arcSineFunc, arcCosineFunc, arcTangentFunc, logFunc, lnFunc, sqrtFunc, absFunc,
    openParenthesis, closeParenthesis,
    integer, decimal, float, number, arithmetic
]



const orFunc = FiniteStateAutomata.basicFSA('|');
orFunc.setName("Or function");
orFunc.setFinalToken(token.Or);

const andFunc = FiniteStateAutomata.basicFSA('&');
andFunc.setName("And function");
andFunc.setFinalToken(token.And);

const positiveClosure = FiniteStateAutomata.basicFSA("+");
positiveClosure.setName("Positive closure");
positiveClosure.setFinalToken(token.PositiveClosure);

const kleeneClosure = FiniteStateAutomata.basicFSA("*");
kleeneClosure.setName("Kleene closure");
kleeneClosure.setFinalToken(token.KleeneClosure);

const optionalClosure = FiniteStateAutomata.basicFSA("?");
optionalClosure.setName("Optional closure");
optionalClosure.setFinalToken(token.OptionalClosure);

const symbol = FiniteStateAutomata.basicFSA("\\w");
symbol.join(FiniteStateAutomata.basicFSA("\\d"));
symbol.join(FiniteStateAutomata.basicFSA("\\+", false));
symbol.join(FiniteStateAutomata.basicFSA("\\*", false));
symbol.join(FiniteStateAutomata.basicFSA("\\?", false));
symbol.join(FiniteStateAutomata.basicFSA("\\(", false));
symbol.join(FiniteStateAutomata.basicFSA("\\)", false));
symbol.join(FiniteStateAutomata.basicFSA("\\|", false));
symbol.join(FiniteStateAutomata.basicFSA("\\&", false));
symbol.join(FiniteStateAutomata.basicFSA("\\\\", false));
symbol.join(FiniteStateAutomata.basicFSA("\\d", false));
symbol.join(FiniteStateAutomata.basicFSA("\\w", false));
symbol.setName("Symbol");
symbol.setFinalToken(token.Symbol);

const regularExpressions = FiniteStateAutomata.superJoin([
    orFunc, andFunc, positiveClosure, kleeneClosure, optionalClosure, symbol, openParenthesis, closeParenthesis
]);
regularExpressions.setName("Regular expressions");

const regExpGrammar = new CFG(new Set([token.Or, token.And, token.PositiveClosure, token.KleeneClosure, token.OptionalClosure, token.Symbol, token.OpenParenthesis, token.CloseParenthesis]), new Set(['E', 'T', 'C', 'F']), 'E', regularExpressions);
regExpGrammar.addRule('E', ['E', token.Or, 'T'], function(args){return args[0].join(args[2]);});
regExpGrammar.addRule('E', ['T'], function(args){return args[0]});

regExpGrammar.addRule('T', ['T', token.And, 'C'], function(args){return args[0].concat(args[2]);});
regExpGrammar.addRule('T', ['C'], function(args){return args[0]});

regExpGrammar.addRule('C', ['C', token.PositiveClosure], function(args){return args[0].positiveClosure();});
regExpGrammar.addRule('C', ['C', token.KleeneClosure], function(args){return args[0].kleeneClosure();});
regExpGrammar.addRule('C', ['C', token.OptionalClosure], function(args){return args[0].optionalClosure();});
regExpGrammar.addRule('C', ['F'], function(args){return args[0];});

regExpGrammar.addRule('F', [token.OpenParenthesis, 'E', token.CloseParenthesis], function(args){return args[1]});
regExpGrammar.addRule('F', [token.Symbol], function(args){
    let str = args[0];
    if(Object.values(metaCharacters).includes(str))
        return FiniteStateAutomata.basicFSA(str);
    if(str[0] == '\\')
        return FiniteStateAutomata.basicFSA(str[1], false)
    else
        return FiniteStateAutomata.basicFSA(str, false)
});

regExpGrammar.setName("Regular expressions")
window["regExpGrammar"] = regExpGrammar

const DefaultRegExpAutomatas: Array<FiniteStateAutomata> = [
    orFunc, andFunc, positiveClosure, kleeneClosure, optionalClosure, symbol, openParenthesis, closeParenthesis
]

/*const a = FiniteStateAutomata.basicFSA('a');
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
]*/


export default DefaultAritmeticAutomatas