export function getModelSearchText(item) {
    const { id, provider } = item;
    const name = item.name ? ` ${item.name}` : "";
    const ctx = item.contextWindow ? (() => { const k = Math.round((item.contextWindow / 1024) * 10) / 10; return ` ${Number.isInteger(k) ? `${k}k` : `${k.toFixed(1)}k`}`; })() : "";
    return `${id} ${provider} ${provider}/${id} ${provider} ${id}${name}${ctx}`;
}
/**
 * The /model selector search should rank exact provider-prefixed queries before proxy-provider IDs
 * like openrouter/openai/gpt-5, so keep the bare model ID out of the leading position.
 */
export function getModelSelectorSearchText(item) {
    const { id, provider } = item;
    const name = item.name ? ` ${item.name}` : "";
    const ctx = item.contextWindow ? (() => { const k = Math.round((item.contextWindow / 1024) * 10) / 10; return ` ${Number.isInteger(k) ? `${k}k` : `${k.toFixed(1)}k`}`; })() : "";
    return `${provider} ${provider}/${id} ${provider} ${id}${name}${ctx}`;
}
//# sourceMappingURL=model-search.js.map