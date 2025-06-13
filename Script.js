document.addEventListener('DOMContentLoaded', () => {
    let collateralData = [
        { id: 1, name: '主視覺海報 (Key Visual Poster)', application: '數碼宣傳及實體張貼', version: 'V1.0', status: '設計中', owner: '設計師', history: [{ date: '2025-06-13', note: 'V1.0 - 提供設計簡報及素材予設計師。' }], nextAction: '設計師提交初稿。', dueDate: '2025-06-20' },
        { id: 2, name: '社交媒體延伸設計 (Social Media)', application: 'Facebook/IG 帖子、限時動態', version: 'V1.0', status: '待辦', owner: '設計師', history: [], nextAction: '等待主視覺海報定稿後，提供已確定的文案及尺寸。', dueDate: '2025-06-23' },
        { id: 3, name: '音樂會舞台背景板 (Concert Backdrop)', application: '音樂會舞台背景、嘉賓合照區', version: 'V1.0', status: '待辦', owner: '設計師', history: [], nextAction: '等待主視覺海報定稿後，提供尺寸及 Logo 檔案。', dueDate: '2025-07-30' },
        { id: 4, name: '活動特稿 (Advertorial)', application: '中期宣傳，刊登於合作媒體', version: 'V2.1', status: '待審批', owner: 'Daisy', history: [{ date: '2025-06-12', note: 'V2.0 - 完成主席及阮教授專訪稿。'}, { date: '2025-06-13', note: 'V2.1 - 根據最新情況更新 Key Points。'}], nextAction: '將 V2.1 版本交予主席及阮教授辦公室作最終核實。', dueDate: '2025-06-18' },
        { id: 5, name: '音樂會場刊 (Concert Programme)', application: '音樂會當日派發給觀眾', version: 'V1.0', status: '內容準備中', owner: 'Daisy', history: [{ date: '2025-06-13', note: 'V1.0 - 完成節目流程初稿。'}], nextAction: '1. 向阮教授索取新曲《情繫蔴地》的最終曲詞。\n2. 確認年輕南音演唱者最終名單及簡介。', dueDate: '2025-07-25' },
        { id: 6, name: 'TWN 內容提交表格', application: '內部刊物報導申請', version: 'V2.0', status: '已完成', owner: 'Daisy', history: [{ date: '2025-06-13', note: 'V2.0 - 已按要求更新 Key Points 並提交。'}], nextAction: '等待編輯部回覆。', dueDate: '2025-06-13' },
        { id: 7, name: '司儀稿 (MC Script)', application: '音樂會司儀使用', version: 'V1.0', status: '待辦', owner: 'Daisy', history: [{ date: '2025-06-13', note: 'V1.0 - 已根據流程撰寫初稿。'}], nextAction: '在確認所有演出細節後，將稿件交予司儀。', dueDate: '2025-08-22' },
        { id: 8, name: '重要嘉賓邀請函 (VIP Invitation)', application: '邀請嘉賓出席音樂會', version: 'V1.0', status: '待辦', owner: 'Daisy / 行政部', history: [], nextAction: '確認邀請名單後，交予設計師套用主視覺設計。', dueDate: '2025-07-15' }
    ];

    const grid = document.getElementById('collateral-grid');
    const itemModal = document.getElementById('item-modal');
    const historyModal = document.getElementById('history-modal');
    const itemForm = document.getElementById('item-form');
    const historyForm = document.getElementById('history-form');
    
    let currentFilterStatus = 'all';
    let currentFilterOwner = 'all';

    function getDaysUntil(dueDateStr) {
        if (!dueDateStr) return Infinity;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDateStr);
        const diffTime = due - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    function getDueDateClass(dueDateStr) {
        const daysLeft = getDaysUntil(dueDateStr);
        if (daysLeft < 0) return 'due-date-overdue';
        if (daysLeft <= 7) return 'due-date-soon';
        return 'due-date-normal';
    }
    
    function getStatusBadge(item) {
        const statuses = ['待辦', '內容準備中', '設計中', '待審批', '待製作', '已完成'];
        let options = statuses.map(s => `<option value="${s}" ${item.status === s ? 'selected' : ''}>${s}</option>`).join('');
        return `<select class="status-select status-badge-${item.status.replace(/ /g, '')}" data-id="${item.id}">${options}</select>`;
    }

    function populateOwnerFilter() {
        const ownerFilter = document.getElementById('filter-owner');
        const owners = [...new Set(collateralData.map(item => item.owner))];
        ownerFilter.innerHTML = '<option value="all">全部</option>';
        owners.sort().forEach(owner => {
            const option = document.createElement('option');
            option.value = owner;
            option.textContent = owner;
            ownerFilter.appendChild(option);
        });
        ownerFilter.value = currentFilterOwner;
    }

    function renderGrid() {
        grid.innerHTML = '';
        const filteredData = collateralData.filter(item => {
            const statusMatch = currentFilterStatus === 'all' || item.status === currentFilterStatus;
            const ownerMatch = currentFilterOwner === 'all' || item.owner === currentFilterOwner;
            return statusMatch && ownerMatch;
        });

        if (filteredData.length === 0) {
            grid.innerHTML = `<p class="text-slate-500 md:col-span-2 lg:col-span-3 text-center py-10">沒有符合篩選條件的項目。</p>`;
        }

        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card p-4 flex flex-col space-y-3';
            card.dataset.id = item.id;
            const dueDateClass = getDueDateClass(item.dueDate);

            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-lg text-slate-800 pr-2">${item.name}</h3>
                    <div class="flex-shrink-0">${getStatusBadge(item)}</div>
                </div>
                <p class="text-xs text-slate-500 -mt-2">${item.application}</p>
                <div class="text-sm space-y-2 flex-grow">
                    <div class="flex justify-between">
                        <span class="font-semibold text-slate-600">版本:</span>
                        <span class="font-mono px-2 py-0.5 bg-gray-100 rounded">${item.version}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-semibold text-slate-600">負責人:</span>
                        <div class="text-right editable-container" data-field="owner" data-value="${item.owner}"><span class="editable owner-text p-1">${item.owner}</span></div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-semibold text-slate-600">到期日:</span>
                        <div class="editable-container" data-field="dueDate" data-value="${item.dueDate}"><span class="editable due-date-text font-mono p-1 rounded-md text-xs ${dueDateClass}">${item.dueDate}</span></div>
                    </div>
                    <div>
                        <span class="font-semibold text-slate-600 block mb-1">下一步行動:</span>
                        <div class="editable-container" data-field="nextAction" data-value="${item.nextAction}">
                            <div class="editable next-action-text whitespace-pre-wrap bg-slate-50 p-2 rounded-md">${item.nextAction.replace(/\n/g, '<br>')}</div>
                        </div>
                    </div>
                </div>
                <div class="border-t pt-3 flex justify-between items-center">
                    <button class="text-sm text-blue-600 hover:underline view-history-btn">更新紀錄 (${item.history.length})</button>
                    <button class="text-sm text-red-500 hover:text-red-700 delete-item-btn">刪除</button>
                </div>
            `;
            grid.appendChild(card);
        });
        populateOwnerFilter();
    }
    
    grid.addEventListener('change', e => {
        if (e.target.matches('.status-select')) {
            const itemId = parseInt(e.target.dataset.id);
            const newStatus = e.target.value;
            const item = collateralData.find(i => i.id === itemId);
            if (item) {
                logHistory(itemId, `狀態由 "${item.status}" 更新為 "${newStatus}"`);
                item.status = newStatus;
                renderGrid();
            }
        }
    });
    
    grid.addEventListener('click', e => {
        const target = e.target;
        const container = target.closest('.editable-container');
        const card = target.closest('.card');
        if (!card) return;
        
        const itemId = parseInt(card.dataset.id);
        const item = collateralData.find(i => i.id === itemId);

        if (target.classList.contains('delete-item-btn')) {
            if (confirm(`確定要刪除「${item.name}」嗎？`)) {
                collateralData = collateralData.filter(i => i.id !== itemId);
                renderGrid();
            }
        }
        
        if (target.classList.contains('view-history-btn')) {
            openHistoryModal(item);
        }

        if (container && !container.querySelector('.inline-editor-input')) {
            const field = container.dataset.field;
            const originalValue = container.dataset.value;
            let editorHtml;

            if (field === 'nextAction') {
                editorHtml = `<textarea class="inline-editor-input w-full p-2 border rounded-md text-sm" style="min-height: 80px;">${originalValue}</textarea>`;
            } else if (field === 'dueDate') {
                editorHtml = `<input type="date" class="inline-editor-input" value="${originalValue}">`;
            } else {
                editorHtml = `<input type="text" class="inline-editor-input" value="${originalValue}">`;
            }

            container.innerHTML = `
                ${editorHtml}
                <div class="mt-2 flex justify-end gap-2">
                    <button class="cancel-edit-btn text-xs bg-gray-200 px-2 py-1 rounded">取消</button>
                    <button class="save-edit-btn text-xs bg-blue-600 text-white px-2 py-1 rounded">儲存</button>
                </div>
            `;
            container.querySelector('.inline-editor-input').focus();
        }

        if (target.classList.contains('cancel-edit-btn')) {
            renderGrid();
        }

        if (target.classList.contains('save-edit-btn')) {
            const editorContainer = target.closest('.editable-container');
            const input = editorContainer.querySelector('.inline-editor-input');
            const field = editorContainer.dataset.field;
            const newValue = input.value;

            if (newValue !== item[field]) {
                item[field] = newValue;
                const fieldLabels = {owner: '負責人', dueDate: '到期日', nextAction: '下一步行動'};
                logHistory(itemId, `手動將「${fieldLabels[field]}」更新為 "${newValue}"`);
            }
            renderGrid();
        }
    });

    // Item Modal
    const modalTitle = document.getElementById('modal-title');
    const itemNameInput = document.getElementById('item-name');
    const itemAppInput = document.getElementById('item-application');
    const itemOwnerInput = document.getElementById('item-owner');
    const itemDueDateInput = document.getElementById('item-due-date');
    
    function openItemModal() {
        itemForm.reset();
        modalTitle.textContent = '新增項目';
        itemModal.classList.add('active');
    }
    
    document.getElementById('add-item-btn').addEventListener('click', openItemModal);
    document.getElementById('cancel-btn').addEventListener('click', () => itemModal.classList.remove('active'));
    
    itemForm.addEventListener('submit', e => {
        e.preventDefault();
        const newId = collateralData.length > 0 ? Math.max(...collateralData.map(i => i.id)) + 1 : 1;
        collateralData.push({
            id: newId,
            name: itemNameInput.value.trim(),
            application: itemAppInput.value.trim(),
            version: 'V1.0',
            status: '待辦',
            owner: itemOwnerInput.value.trim(),
            history: [{ date: new Date().toISOString().split('T')[0], note: '項目已建立。' }],
            nextAction: '規劃初始步驟。',
            dueDate: itemDueDateInput.value
        });
        renderGrid();
        itemModal.classList.remove('active');
    });

    // History Modal
    const historyLog = document.getElementById('history-log');
    const historyItemIdInput = document.getElementById('history-item-id');
    const historyNoteInput = document.getElementById('history-note');
    
    function openHistoryModal(item) {
        historyForm.reset();
        historyItemIdInput.value = item.id;
        historyLog.innerHTML = '';
        if (item.history.length === 0) {
            historyLog.innerHTML = '<p class="text-slate-500 text-sm">暫無紀錄。</p>';
        } else {
            [...item.history].reverse().forEach(entry => {
                historyLog.innerHTML += `<div class="text-sm p-2 bg-slate-100 rounded"><span class="font-semibold">${entry.date}:</span> ${entry.note}</div>`;
            });
        }
        historyModal.classList.add('active');
    }

    document.getElementById('close-history-btn').addEventListener('click', () => historyModal.classList.remove('active'));
    historyForm.addEventListener('submit', e => {
        e.preventDefault();
        const itemId = parseInt(historyItemIdInput.value);
        const note = historyNoteInput.value.trim();
        if (note) {
            logHistory(itemId, note);
            const item = collateralData.find(i => i.id === itemId);
            renderGrid();
            openHistoryModal(item);
        }
    });

    function logHistory(itemId, note) {
        const item = collateralData.find(i => i.id === itemId);
        if (item) {
            item.history.push({
                date: new Date().toISOString().split('T')[0],
                note: note
            });
            const versionRegex = /(V|version|版本)\s?(\d+\.\d+)/i;
            const match = note.match(versionRegex);
            if (match && match[2]) {
                item.version = "V" + match[2];
            }
        }
    }
    
    document.getElementById('filter-status').addEventListener('change', e => { currentFilterStatus = e.target.value; renderGrid(); });
    document.getElementById('filter-owner').addEventListener('change', e => { currentFilterOwner = e.target.value; renderGrid(); });

    renderGrid();
});

