let mod: number = 1e7 + 19
let x0: number = 1001

let power = function(a: number, b: number, mod: number): number{
    let ans = 1
    while(b > 0){
        if((b & 1) == 1) ans = ans * a % mod
        b >>= 1
        a = a * a % mod
    }
    return ans
}

export class AVLNode<K, T> {
    left: null|AVLNode<K, T>
    right: null|AVLNode<K, T>

    size: number
    height: number

    key: K
    value: T

    keyHashFunc: ((key: K)=>number)|null
    hash: number

    constructor(key: K, value: T, keyHashFunc: ((key: K)=>number)|null){
        this.key = key
        this.value = value
        this.keyHashFunc = keyHashFunc
        this.left = this.right = null
        this.height = this.size = 1
        this.hash = 0
        if(this.keyHashFunc)
            this.hash = power(x0, this.keyHashFunc(key), mod)
    }

    balance(): number{
        return (this.right ? this.right.height : 0) - (this.left ? this.left.height : 0)
    }

    update(): void{
		this.height = 1 + Math.max(this.left ? this.left.height : 0, this.right ? this.right.height : 0)
        this.size = 1 + (this.left ? this.left.size : 0) + (this.right ? this.right.size : 0)
        if(this.keyHashFunc)
            this.hash = ((this.left ? this.left.hash : 0) + power(x0, this.keyHashFunc(this.key), mod) + (this.right ? this.right.hash : 0)) % mod
    }
    
    leftRotate(): AVLNode<K, T>{
        let x: AVLNode<K, T> = this
        let y: AVLNode<K, T> = x.right!
        let t: AVLNode<K, T> = y.left!
        y.left = x
        x.right = t
        x.update()
        y.update()
		return y
	}

	rightRotate(): AVLNode<K, T>{
        let y: AVLNode<K, T> = this
        let x: AVLNode<K, T> = y.left!
        let t: AVLNode<K, T> = x.right!
        x.right = y
        y.left = t
        y.update()
        x.update()
		return x
    }

    updateBalance(): AVLNode<K, T>{
        let bal = this.balance()
        if(bal > 1){
            if(this.right!.balance() < 0)
            this.right = this.right!.rightRotate()
            return this.leftRotate()
        }else if(bal < -1){
            if(this.left!.balance() > 0)
                this.left = this.left!.leftRotate()
            return this.rightRotate()
        }else{
            return this
        }
    }

	maxLeftChild(): AVLNode<K, T>|null{
		let ret: AVLNode<K, T> = this
		while(ret.left) ret = ret.left
		return ret
	}
}

export class AVLTree<K, T> {
    private root: null|AVLNode<K, T>

    comparer: ((LHS: K, RHS: K)=>number)
    keyHashFunc: ((key: K)=>number)|null

    constructor(comparer: ((LHS: K, RHS: K)=>number), keys: Array<K> = [], values: Array<T> = [], keyHashFunc: ((key: K)=>number) | null = null){
        this.root = null
        this.comparer = comparer
        if(keyHashFunc)
            this.keyHashFunc = keyHashFunc
        else
            this.keyHashFunc = function(key: K): number{
                if(typeof key === "number") return Math.abs(key)
                return 0
            }
        for(let i = 0; i < keys.length; ++i)
            this.set(keys[i], values[i])
    }

    private nodeSize(pos: AVLNode<K, T>|null): number{
        return pos ? pos.size : 0
    }

    size(): number{
        return this.nodeSize(this.root)
    }

    private insertRec(pos: AVLNode<K, T>|null, key: K, value: T): AVLNode<K, T>{
        if(pos){
            let comp = this.comparer(key, pos.key)
            if(comp < 0)
                pos.left = this.insertRec(pos.left, key, value)
            else if(comp > 0)
                pos.right = this.insertRec(pos.right, key, value)
            else{
                pos.value = value
                return pos
            }
            pos.update()
            return pos.updateBalance()
        }else{
            return new AVLNode(key, value, this.keyHashFunc)
        }
    }

    private eraseRec(pos: AVLNode<K, T>|null, key: K): AVLNode<K, T>|null{
        if(!pos) return pos
        let comp = this.comparer(key, pos.key)
        if(comp < 0)
            pos.left = this.eraseRec(pos.left, key)
        else if(comp > 0)
            pos.right = this.eraseRec(pos.right, key)
        else{
            if(!pos.left)
                pos = pos.right
            else if(!pos.right)
                pos = pos.left
            else{
                let temp: AVLNode<K, T> = pos.right.maxLeftChild()!
                pos.key = temp.key
                pos.value = temp.value
                pos.right = this.eraseRec(pos.right, temp.key)
            }
        }
        if(!pos) return pos
        pos.update()
        return pos.updateBalance()
    }

    private forEachRec(pos: AVLNode<K, T>|null, callback: ((value: T, key: K)=>any) | null): void{
        if(!pos || !callback) return
        this.forEachRec(pos.left, callback)
        callback(pos.value, pos.key)
        this.forEachRec(pos.right, callback)
    }

    private nthElementRec(pos: AVLNode<K, T>|null, n: number): AVLNode<K, T>|null{
        if(!pos) return null
        if(0 > n || n >= this.nodeSize(pos)) return null
        let curr = this.nodeSize(pos.left)
        if(n == curr)
            return pos
        else if(n < curr)
            return this.nthElementRec(pos.left, n)
        else
            return this.nthElementRec(pos.right, n - curr - 1)
    }

    set(key: K, value: T): void{
        this.root = this.insertRec(this.root, key, value)
    }

    get(key: K): T|null{
        let pos: AVLNode<K, T>|null = this.root
        while(pos){
            let comp = this.comparer(key, pos.key)
            if(comp == 0) break
            pos = (comp < 0 ? pos.left : pos.right)
        }
        return pos ? pos.value : null
    }

    has(key: K): boolean{
        let pos: AVLNode<K, T>|null = this.root
        while(pos){
            let comp = this.comparer(key, pos.key)
            if(comp == 0) return true
            pos = (comp < 0 ? pos.left : pos.right)
        }
        return false
    }

    erase(key: K): void{
        this.root = this.eraseRec(this.root, key)
    }

    updateKey(key: K, newValue: T): void{
        if(this.has(key)){
            this.erase(key)
            this.set(key, newValue)
        }
    }

    inorder(callback: ((value: T, key: K)=>any) | null): void{
        this.forEachRec(this.root, callback)
    }

    nthElement(n: number): AVLNode<K, T>|null{
        return this.nthElementRec(this.root, n)
    }

    hash(): number{
        if(this.root) return this.root.hash
        return 0
    }

    compareTo(other: AVLTree<K, T>): number{
        if(this.hash() != other.hash()) return this.hash() - other.hash()
        let sz = Math.min(this.size(), other.size())
        for(let i = 0; i < sz; ++i){
            let comp = this.comparer(this.nthElement(i)!.key, other.nthElement(i)!.key)
            if(comp != 0) return comp
        }
        return this.size() - other.size()
    }

    join(other: AVLTree<K, T>): void{
        other.inorder((value, key) => this.set(key, value))
    }

    clear(): void{
        this.root = null
    }
}

export class AVLMap<K, T> extends AVLTree<K, T>{
    constructor(comparer: ((LHS: K, RHS: K)=>number), pairs: Array<[K, T]> = [], keyHashFunc: ((key: K)=>number) | null = null){
        let keys: Array<K> = []
        let values: Array<T> = []
        pairs.forEach(pair => {
            keys.push(pair[0])
            values.push(pair[1])
        })
        super(comparer, keys, values, keyHashFunc)
    }

    keys(): Array<K>{
        let result: Array<K> = []
        this.inorder((_, key) => result.push(key))
        return result
    }

    values(): Array<T>{
        let result: Array<T> = []
        this.inorder((value, _) => result.push(value))
        return result
    }

    toArray(): Array<[K, T]>{
        let result: Array<[K, T]> = []
        this.inorder((value, key) => result.push([key, value]))
        return result
    }

    forEach(callback: ((value: T, key: K)=>any) | null): void{
        if(!callback) return
        let tmp = this.toArray()
        tmp.forEach(pair => callback(pair[1], pair[0]))
    }

    clone(): AVLMap<K, T>{
        let result = new AVLMap<K, T>(this.comparer, [], this.keyHashFunc)
        this.inorder((value, key) => result.set(key, value))
        return result
    }
}

export class AVLSet<K> extends AVLTree<K, undefined>{
    constructor(comparer: ((LHS: K, RHS: K)=>number), keys: Array<K> = [], keyHashFunc: ((key: K)=>number) | null = null){
        super(comparer, keys, [], keyHashFunc)
    }

    add(key: K): void{
        this.set(key, undefined)
    }

    toArray(): Array<K>{
        let result: Array<K> = []
        this.inorder((_, key) => result.push(key))
        return result
    }

    forEach(callback: ((key: K)=>any) | null): void{
        if(!callback) return
        let tmp = this.toArray()
        tmp.forEach(key => callback(key))
    }

    clone(): AVLSet<K>{
        let result = new AVLSet<K>(this.comparer, [], this.keyHashFunc)
        this.inorder((_, key) => result.add(key))
        return result
    }
}

let stringComp = function(a: string, b: string){return a == b ? 0 : (a < b ? -1 : 1)}
let arrComp = function(a: Array<string>, b: Array<string>){let strA = a.join("\0"); let strB = b.join("\0"); return stringComp(strA, strB);}
let intComp = function(a: number, b: number){return a - b}
export {stringComp, arrComp, intComp}