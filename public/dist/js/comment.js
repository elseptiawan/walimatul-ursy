import { pagination } from './pagination.js';
import { card } from './card.js';

export const comment = (() => {
    const send = async (button) => {
        const id = button.getAttribute('data-uuid');

        const name = document.getElementById('form-name');
        if (name.value.length == 0) {
            alert('Please fill name');
            return;
        }

        const presence = document.getElementById('form-presence');
        if (!id && presence && presence.value == "0") {
            alert('Please select presence');
            return;
        }

        if (presence) {
            presence.disabled = true;
        }

        const form = document.getElementById(`form-${id ? `inner-${id}` : 'comment'}`);
        form.disabled = true;

        const cancel = document.querySelector(`[onclick="comment.cancel('${id}')"]`);
        if (cancel) {
            cancel.disabled = true;
        }

        const btn = util.disableButton(button);

        const response = await request(HTTP_POST, '/api/comment')
            .token(session.get('token'))
            .body({
                id: id,
                name: name.value,
                presence: presence ? presence.value === "1" : true,
                comment: form.value
            })
            .then();

        form.disabled = false;
        if (cancel) {
            cancel.disabled = false;
        }

        if (presence) {
            presence.disabled = false;
        }

        btn.restore();

        if (response?.code === 201) {
            owns.set(response.data.uuid, response.data.own);
            form.value = null;
            if (presence) {
                presence.value = "0";
            }
            comment();
        }
    };
    const comment = async () => {
        card.renderLoading();
        const origin = window.location.origin
        $.ajax({
            url: origin + `/api/comments?per=${pagination.getPer()}&next=${pagination.getNext()}`,
            type: "get",
            success: function(data) {
                console.log(data.data);
                if (data.code !== 200) {
                    return;
                }
    
                const comments = document.getElementById('comments');
                pagination.setResultData(data.data.length);
    
                if (data.data.length === 0) {
                    comments.innerHTML = `<div class="h6 text-center fw-bold p-4 my-3 bg-theme-${theme.isDarkMode('dark', 'light')} rounded-4 shadow">Yuk bagikan undangan ini biar banyak komentarnya</div>`;
                    return;
                }
    
                comments.innerHTML = data.data.map((comment) => card.renderContent(comment)).join('');
                data.data.map((c) => card.fetchTracker(c));
            }
        });
    }

    return {
        send,
        comment,
        renderLoading: card.renderLoading,
    }
})();