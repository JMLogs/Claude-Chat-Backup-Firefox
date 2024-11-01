document.addEventListener('DOMContentLoaded', async () => {
    const conversationList = document.getElementById('conversationList');
    const exportSelectedBtn = document.getElementById('exportSelectedBtn');

    if (conversationList) {
        const organizationId = await getOrganizationId();
        if (organizationId) {
            const conversations = await fetchConversations(organizationId);
            conversations.forEach(conv => {
                const listItem = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = conv.uuid;
                const label = document.createElement('label');
                label.textContent = conv.name;
                listItem.appendChild(checkbox);
                listItem.appendChild(label);
                conversationList.appendChild(listItem);
            });
        }
    }

    if (exportSelectedBtn) {
        exportSelectedBtn.addEventListener('click', () => {
            const selectedIds = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(checkbox => checkbox.id);
            browser.runtime.sendMessage({ action: "exportSelectedConversations", selectedIds });
        });
    }
});
