$('#search-form').on('submit', e =>  {
    e.preventDefault();
    $('#results').html(`
        <div class="overlay-loader">
            <div class="loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>`);
    let subreddit = $('#search-box').val();
    let promise = $.ajax({
        type: 'GET',
        url: `https://www.reddit.com/r/${subreddit}.json`
    })

    promise.then(json => {
        let html = '<ul>';
        json.data.children.forEach(thread => {
            html += `
                <li>
                    <a href="${thread.data.url}" target="_blank">${thread.data.title}</a>
                </li>
                <ul>
                    <li>Score: ${thread.data.score}</li>
                    <li>Author: ${thread.data.author}</li>
                </ul>
            `;
        });
        html += '</ul>';

        let sanitizedHtml = DOMPurify.sanitize(html);

        $('#results').html(sanitizedHtml);
    });
});