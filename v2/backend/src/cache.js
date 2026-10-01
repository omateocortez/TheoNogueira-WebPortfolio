function createCache({ ttlMs }) {
    const store = new Map();

    async function getOrFetch(key, fetchFn) {
        const entry = store.get(key);
        const now = Date.now();

        if (entry && entry.expiresAt > now) {
            return entry.value;
        }

        try {
            const value = await fetchFn();
            store.set(key, { value, expiresAt: now + ttlMs });
            return value;
        } catch (error) {
            if (entry) {
                console.warn(
                    `[cache] falha ao atualizar "${key}" (${error.message}); usando valor expirado`
                );
                return entry.value;
            }
            throw error;
        }
    }

    return { getOrFetch };
}

module.exports = { createCache };
