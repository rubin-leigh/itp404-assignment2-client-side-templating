Handlebars.registerHelper('formatted-num', function(num) {
    return num.toLocaleString();
})
  
const subredditTemplate = Handlebars.compile(
    document.querySelector('#subreddit-template').innerHTML
)

$('#search-form').on('submit', async function(e)  {
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
    try {
        let subreddits = await $.getJSON(`https://www.reddit.com/r/${subreddit}.json`)
        
        let threads = subreddits.data.children;
        let sanitizedHtml = subredditTemplate({ threads });
        $('#results').html(sanitizedHtml);
    } catch (error) {
        $('#results').html('Oops, something went wrong.');
    }
});