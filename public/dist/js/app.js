import { util } from './util.js';
import { like } from './like.js';
// import { theme } from './theme.js';
import { audio } from './audio.js';
// import { comment } from './comment.js';
import { progress } from './progress.js';
import { pagination } from './pagination.js';

window.util = util;
window.like = like;
// window.theme = theme;
window.audio = audio;
// window.comment = comment;
window.progress = progress;
window.pagination = pagination;

// $(document).ready(function() {
//     comment();
// });
const comment = () => {
    const origin = window.location.origin
    $.ajax({
        url: origin + "/api/comments",
        type: "get",
        // data: {
        //     _token: $("#csrf").val(),
        //     id_barang: id_barang,
        //     nama_barang: nama_barang,
        //     harga_beli: harga_beli,
        //     harga_jual: harga_jual,
        //     jumlah: jumlah,
        //     satuan: satuan,
        //     status: status,
        //     tanggal: tanggal,
        // },
        success: function(data) {
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
};