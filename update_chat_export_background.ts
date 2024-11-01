export async function exportSelectedConversations(selectedIds: string[]) {
    try {
        const organizationId = await getCookie();
        if (!organizationId) {
            console.error("Required cookie not found");
            return;
        }

        const detailPromises = selectedIds.map(id =>
            fetch(`https://claude.ai/api/organizations/${organizationId}/chat_conversations/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
        );

        const detailedConversations = await Promise.all(detailPromises);

        for (const conversation of detailedConversations) {
            const jsonData = JSON.stringify(conversation, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const filename = `${conversation.name}_claude_conversation.json`;
            
            await browser.downloads.download({
                url: url,
                filename: filename,
                saveAs: true
            });
            URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error("Error exporting selected conversations:", error);
    }
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "exportSelectedConversations") {
        exportSelectedConversations(message.selectedIds);
    }
});
