
export type productionText = Array<any>
export interface production {
	RHS: productionText,
	callback: (args: Array<any>)=>any
}