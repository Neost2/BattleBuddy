/** Mock of expo-crypto: deterministic-length random bytes for tests. */
export const getRandomBytesAsync = async (n: number): Promise<Uint8Array> => {
	const arr = new Uint8Array(n)
	for (let i = 0; i < n; i++) arr[i] = Math.floor(Math.random() * 256)
	return arr
}
