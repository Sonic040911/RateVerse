document.getElementById('createBtn').addEventListener('click', async () => {
    try {
        // 1. 调用创建草稿接口
        const response = await fetch('/api/drafts', {
            method: 'POST',
            credentials: 'include' // 携带Cookie
        });
        const result = await response.json();

        // 如果已经有一个评分草稿
        if (result.code === 602) {
            const draftId = result.data.draftId;
            // 2. 弹出对话框询问用户是否继续编辑已存在的草稿
            if (confirm("你有未完成的草稿，是否继续编辑？\n点击【确定】继续编辑，点击【取消】丢弃草稿并创建新草稿。")) {
                // 用户选择继续，则直接跳转到 Create.html 并传递当前 draftId
                window.location.href = `Create.html?draftId=${draftId}`;
            } else {
                // 用户选择丢弃草稿
                // 3. 调用删除草稿接口
                const deleteResponse = await fetch(`/api/drafts/${draftId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const deleteResult = await deleteResponse.json();
                if (deleteResult.flag) {
                    // 4. 删除成功后，再调用创建草稿接口获取新的 draftId
                    const newResponse = await fetch('/api/drafts', {
                        method: 'POST',
                        credentials: 'include'
                    });
                    const newResult = await newResponse.json();
                    if (newResult.flag) {
                        window.location.href = `Create.html?draftId=${newResult.data.draftId}`;
                    } else {
                        alert(`创建新草稿失败: ${newResult.message}`);
                    }
                } else {
                    alert(`删除草稿失败: ${deleteResult.message}`);
                }
            }
        } else {
            // 没有草稿就跳转去创建
            window.location.href = `Create.html?draftId=${result.data.draftId}`;
        }
    } catch (error) {
        alert('网络请求异常');
    }
});
