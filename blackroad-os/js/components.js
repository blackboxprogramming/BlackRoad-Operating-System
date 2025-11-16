/**
 * Component Library
 * Simple, reusable UI components for building app interfaces
 * Pure vanilla JS - no frameworks required
 * TODO: Extend with more components as needed
 */

const Components = {
    /**
     * Create a Card component
     * @param {Object} options - { title, subtitle, content, footer }
     * @returns {HTMLElement}
     */
    Card(options = {}) {
        const card = document.createElement('div');
        card.className = 'card';

        if (options.title) {
            const header = document.createElement('div');
            header.className = 'card-header';

            const titleDiv = document.createElement('div');
            const title = document.createElement('div');
            title.className = 'card-title';
            title.textContent = options.title;
            titleDiv.appendChild(title);

            if (options.subtitle) {
                const subtitle = document.createElement('div');
                subtitle.className = 'card-subtitle';
                subtitle.textContent = options.subtitle;
                titleDiv.appendChild(subtitle);
            }

            header.appendChild(titleDiv);
            if (options.headerActions) {
                header.appendChild(options.headerActions);
            }
            card.appendChild(header);
        }

        if (options.content) {
            const body = document.createElement('div');
            body.className = 'card-body';
            if (typeof options.content === 'string') {
                body.innerHTML = options.content;
            } else {
                body.appendChild(options.content);
            }
            card.appendChild(body);
        }

        if (options.footer) {
            const footer = document.createElement('div');
            footer.className = 'card-footer';
            if (typeof options.footer === 'string') {
                footer.innerHTML = options.footer;
            } else {
                footer.appendChild(options.footer);
            }
            card.appendChild(footer);
        }

        return card;
    },

    /**
     * Create a Badge component
     * @param {string} text - Badge text
     * @param {string} type - success | warning | error | info | neutral
     * @returns {HTMLElement}
     */
    Badge(text, type = 'neutral') {
        const badge = document.createElement('span');
        badge.className = `badge ${type}`;
        badge.textContent = text;
        return badge;
    },

    /**
     * Create a Table component
     * @param {Array} columns - [{ key, label }]
     * @param {Array} data - Array of row objects
     * @returns {HTMLElement}
     */
    Table(columns, data) {
        const container = document.createElement('div');
        container.className = 'table-container';

        const table = document.createElement('table');
        table.className = 'table';

        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.label;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        data.forEach(row => {
            const tr = document.createElement('tr');
            columns.forEach(col => {
                const td = document.createElement('td');
                const value = row[col.key];
                if (value instanceof HTMLElement) {
                    td.appendChild(value);
                } else {
                    td.innerHTML = value || '-';
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        container.appendChild(table);
        return container;
    },

    /**
     * Create a List component
     * @param {Array} items - [{ icon, title, subtitle, actions }]
     * @returns {HTMLElement}
     */
    List(items) {
        const list = document.createElement('ul');
        list.className = 'list';

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-item';

            if (item.icon) {
                const icon = document.createElement('div');
                icon.className = 'list-item-icon';
                icon.innerHTML = item.icon;
                li.appendChild(icon);
            }

            const content = document.createElement('div');
            content.className = 'list-item-content';

            const title = document.createElement('div');
            title.className = 'list-item-title';
            title.textContent = item.title;
            content.appendChild(title);

            if (item.subtitle) {
                const subtitle = document.createElement('div');
                subtitle.className = 'list-item-subtitle';
                subtitle.textContent = item.subtitle;
                content.appendChild(subtitle);
            }

            li.appendChild(content);

            if (item.actions) {
                const actions = document.createElement('div');
                actions.className = 'list-item-actions';
                actions.appendChild(item.actions);
                li.appendChild(actions);
            }

            if (item.onClick) {
                li.style.cursor = 'pointer';
                li.addEventListener('click', item.onClick);
            }

            list.appendChild(li);
        });

        return list;
    },

    /**
     * Create a Stats Box
     * @param {Object} options - { value, label, change }
     * @returns {HTMLElement}
     */
    StatsBox(options) {
        const box = document.createElement('div');
        box.className = 'stats-box';

        const value = document.createElement('div');
        value.className = 'stats-value';
        value.textContent = options.value;
        box.appendChild(value);

        const label = document.createElement('div');
        label.className = 'stats-label';
        label.textContent = options.label;
        box.appendChild(label);

        if (options.change !== undefined) {
            const change = document.createElement('div');
            change.className = `stats-change ${options.change >= 0 ? 'positive' : 'negative'}`;
            change.textContent = `${options.change >= 0 ? '+' : ''}${options.change}%`;
            box.appendChild(change);
        }

        return box;
    },

    /**
     * Create a Grid container
     * @param {number} columns - Number of columns (2, 3, 4, or 'auto')
     * @param {Array} children - Array of HTMLElements
     * @returns {HTMLElement}
     */
    Grid(columns, children) {
        const grid = document.createElement('div');
        grid.className = `grid grid-${columns}`;
        children.forEach(child => grid.appendChild(child));
        return grid;
    },

    /**
     * Create a Graph Placeholder
     * @param {string} label - Placeholder text
     * @returns {HTMLElement}
     */
    GraphPlaceholder(label = 'Chart Visualization') {
        const placeholder = document.createElement('div');
        placeholder.className = 'graph-placeholder';
        placeholder.textContent = label;
        return placeholder;
    },

    /**
     * Create a Button
     * @param {string} text - Button text
     * @param {Object} options - { type: 'primary'|'danger', size: 'small', onClick }
     * @returns {HTMLElement}
     */
    Button(text, options = {}) {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = text;

        if (options.type) {
            btn.classList.add(options.type);
        }

        if (options.size) {
            btn.classList.add(options.size);
        }

        if (options.onClick) {
            btn.addEventListener('click', options.onClick);
        }

        return btn;
    },

    /**
     * Create an Empty State
     * @param {Object} options - { icon, title, text }
     * @returns {HTMLElement}
     */
    EmptyState(options) {
        const container = document.createElement('div');
        container.className = 'empty-state';

        if (options.icon) {
            const icon = document.createElement('div');
            icon.className = 'empty-state-icon';
            icon.textContent = options.icon;
            container.appendChild(icon);
        }

        if (options.title) {
            const title = document.createElement('div');
            title.className = 'empty-state-title';
            title.textContent = options.title;
            container.appendChild(title);
        }

        if (options.text) {
            const text = document.createElement('div');
            text.className = 'empty-state-text';
            text.textContent = options.text;
            container.appendChild(text);
        }

        return container;
    },

    /**
     * Create a Loading Spinner
     * @returns {HTMLElement}
     */
    Spinner() {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        return spinner;
    },

    /**
     * Create a Code Block
     * @param {string} code - Code content
     * @returns {HTMLElement}
     */
    CodeBlock(code) {
        const block = document.createElement('pre');
        block.className = 'code-block';
        block.textContent = code;
        return block;
    },

    /**
     * Create a Sidebar Layout
     * @param {HTMLElement} sidebar - Sidebar content
     * @param {HTMLElement} content - Main content
     * @returns {HTMLElement}
     */
    SidebarLayout(sidebar, content) {
        const layout = document.createElement('div');
        layout.className = 'sidebar-layout';

        const sidebarEl = document.createElement('div');
        sidebarEl.className = 'sidebar';
        sidebarEl.appendChild(sidebar);

        const contentEl = document.createElement('div');
        contentEl.className = 'sidebar-content';
        contentEl.appendChild(content);

        layout.appendChild(sidebarEl);
        layout.appendChild(contentEl);

        return layout;
    },

    /**
     * Create Tabs
     * @param {Array} tabs - [{ id, label, content }]
     * @returns {HTMLElement}
     */
    Tabs(tabs) {
        const container = document.createElement('div');

        const tabsHeader = document.createElement('div');
        tabsHeader.className = 'tabs';

        const contentContainer = document.createElement('div');
        contentContainer.className = 'tab-content';

        tabs.forEach((tab, index) => {
            const tabBtn = document.createElement('div');
            tabBtn.className = 'tab';
            tabBtn.textContent = tab.label;
            if (index === 0) tabBtn.classList.add('active');

            const tabContent = document.createElement('div');
            tabContent.id = `tab-${tab.id}`;
            tabContent.style.display = index === 0 ? 'block' : 'none';
            if (typeof tab.content === 'string') {
                tabContent.innerHTML = tab.content;
            } else {
                tabContent.appendChild(tab.content);
            }

            tabBtn.addEventListener('click', () => {
                // Deactivate all tabs
                tabsHeader.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                contentContainer.querySelectorAll('[id^="tab-"]').forEach(c => c.style.display = 'none');

                // Activate clicked tab
                tabBtn.classList.add('active');
                tabContent.style.display = 'block';
            });

            tabsHeader.appendChild(tabBtn);
            contentContainer.appendChild(tabContent);
        });

        container.appendChild(tabsHeader);
        container.appendChild(contentContainer);

        return container;
    }
};

// Make globally available
window.Components = Components;
