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

    let promise = fetchTimeout(5000, $.ajax({
        type: 'GET',
        url: `https://www.reddit.com/r/${subreddit}.json`,
    }));


    promise.then(json => {
        let html = '<ul>';
        json.data.children.forEach(thread => {
            html += `
                <li>
                    <a target="_blank" href="${thread.data.url}">${thread.data.title}</a>
                </li>
                <ul>
                    <li>Score: ${thread.data.score}</li>
                    <li>Author: ${thread.data.author}</li>
                </ul>
            `;
        });
        html += '</ul>';

        DOMPurify.addHook('afterSanitizeAttributes', function(node) {
            // set all elements owning target to target=_blank
            if ('target' in node) {
                node.setAttribute('target','_blank');
            }
            // set non-HTML/MathML links to xlink:show=new
            if (!node.hasAttribute('target') 
                && (node.hasAttribute('xlink:href') 
                    || node.hasAttribute('href'))) {
                node.setAttribute('xlink:show', 'new');
            }
        });

        let sanitizedHtml = DOMPurify.sanitize(html);

        $('#results').html(sanitizedHtml);
    })
    .catch(error => $('#results').html('No results found.'));
});

function fetchTimeout(m, p) {
    const timeout = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, m);
    });
    return Promise.race([timeout, p]);
  }