// Lightweight, compatible showToast helper.
// Supports two call styles:
// 1) showToast(message, type = 'info', duration = 5000)
// 2) showToast({ message, actionLabel, onAction, type, duration })
(function () {
    function createToastElement(message, type, opts) {
        const toast = document.createElement('div');
        // Keep compatibility with existing CSS expecting `toast` and type classes
        toast.className = `toast ${type || 'info'}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const icon = icons[type] || icons.info;
        const iconEl = document.createElement('i');
        iconEl.className = `fas ${icon}`;
        const textEl = document.createElement('span');
        textEl.textContent = message || 'Notification';

        toast.appendChild(iconEl);
        toast.appendChild(textEl);

        // If there's an action specified (for object-style usage), append a button
        if (opts && opts.actionLabel) {
            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '8px';

            const actionBtn = document.createElement('button');
            actionBtn.textContent = opts.actionLabel;
            actionBtn.style.background = '#10b981';
            actionBtn.style.color = '#fff';
            actionBtn.style.border = 'none';
            actionBtn.style.padding = '6px 10px';
            actionBtn.style.borderRadius = '6px';
            actionBtn.style.cursor = 'pointer';
            actionBtn.addEventListener('click', function () {
                try { if (typeof opts.onAction === 'function') opts.onAction(); } catch (e) { }
                toast.remove();
            });

            actions.appendChild(actionBtn);
            toast.appendChild(actions);
        }

        return toast;
    }

    window.showToast = function (arg1, arg2, arg3) {
        try {
            const container = document.getElementById('toastContainer');
            if (!container) return;

            // Normalize arguments
            let message, type, duration, opts;

            if (typeof arg1 === 'string' || typeof arg1 === 'number') {
                // Called as showToast(message, type, duration)
                message = String(arg1);
                type = typeof arg2 === 'string' ? arg2 : 'info';
                duration = typeof arg3 === 'number' ? arg3 : 5000;
                opts = null;
            } else if (arg1 && typeof arg1 === 'object') {
                // Called as showToast({ message, actionLabel, onAction, type, duration })
                opts = arg1;
                message = opts.message || 'Notification';
                type = opts.type || 'info';
                duration = typeof opts.duration === 'number' ? opts.duration : 8000;
            } else {
                // No valid args
                return;
            }

            const toast = createToastElement(message, type, opts);

            container.appendChild(toast);

            // Auto-dismiss after duration
            setTimeout(() => { try { toast.remove(); } catch (e) { } }, duration);
        } catch (e) {
            /* ignore errors to avoid breaking host pages */
        }
    };
})();
