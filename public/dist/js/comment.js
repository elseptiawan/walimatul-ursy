import { pagination } from './pagination.js';
import { card } from './card.js';

export const comment = (() => {
    const send = async (button) => {
        const origin = window.location.origin
        const name = document.getElementById('form-name');
        if (name.value.length == 0) {
            alert('Please fill name');
            return;
        }

        const presence = document.getElementById('form-presence');
        const is_present = presence.value == "true" ? true : false;
        if (presence && presence.value == "0") {
            alert('Please select presence');
            return;
        }

        if (presence) {
            presence.disabled = true;
        }

        const form = document.getElementById(`form-comment`);
        form.disabled = true;

        // const cancel = document.querySelector(`[onclick="comment.cancel('${id}')"]`);
        // if (cancel) {
        //     cancel.disabled = true;
        // }

        const btn = util.disableButton(button);

        $.ajax({
            url: origin + "/api/comments",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify({
                name: name.value,
                is_present: is_present,
                comment: form.value
            }),
            success: function(data) {
                form.disabled = false;

                if (presence) {
                    presence.disabled = false;
                }

                btn.restore();

                if (data?.status === 201) {
                    form.value = null;
                    if (presence) {
                        presence.value = "0";
                    }
                    comment();
                }
            }
        });
    };
    const comment = async () => {
        card.renderLoading();
        const origin = window.location.origin
        $.ajax({
            url: origin + `/api/comments?per=${pagination.getPer()}&next=${pagination.getNext()}`,
            type: "get",
            success: function(data) {
                if (data.code !== 200) {
                    return;
                }
    
                const comments = document.getElementById('comments');
                pagination.setResultData(data.total);
    
                if (data.data.length === 0) {
                    comments.innerHTML = `<div class="h6 text-center fw-bold p-4 my-3 rounded-4 shadow">Yuk bagikan undangan ini biar banyak komentarnya</div>`;
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