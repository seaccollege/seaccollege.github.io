<script>
    // Reusable underline component
    // Props:
    // - `maxWidth`: number (px) or string (e.g. '50%') to set the underline width
    // - `mt`: CSS margin-top value (default '0.5rem')
    // - `className`: additional classes to apply
    export let maxWidth = 1;
    export let mt = "0.5rem";
    export let className = "";
    export let extraStyle = "";

    $: computedMaxWidth =
        typeof maxWidth === "number" ? `${maxWidth}rem` : `${maxWidth}`;
    $: styleAttr = `max-width: ${computedMaxWidth}; margin-top: ${mt}; ${extraStyle}`;
</script>

<div
    class={`w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full ${className}`}
    style={styleAttr}
    aria-hidden="true"
></div>
