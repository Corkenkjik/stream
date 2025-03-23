const position = new Map() as Map<string, number>
position.set("Synn2k4", 1)
position.set("Chad Afra@36", 2)
position.set("VEDC OC 4", 3)
position.set("", 4)
position.set("", 5)
position.set("", 6)
position.set("TestOC1", 7)
position.set("Elton Back&91", 8)
position.set("Anhluoi11", 9)
position.set("", 10)

export { position }

export const getPosition = (name: string) => {
  const pos = position.get(name)
  if (!pos) {
    throw new Error("Cannot find position of player " + name)
  }
  // return pos || 0
}
