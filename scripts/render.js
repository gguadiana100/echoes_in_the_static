async function loadYAML(url) {
    const response = await fetch(url);
    const text = await response.text();
    return jsyaml.load(text);
}

async function loadMetadata() {
    const metadata = await loadYAML('source/metadata.yaml');
    
    // Display the title and author
    document.title = metadata.title;
    document.getElementById('main').querySelector('h1').innerText = metadata.title;
    document.getElementById('author').innerText = metadata.author;
    
    // Generate table of contents
    const toc = document.getElementById('table-of-contents');
    metadata.chapters.forEach((chapter, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#chapter-${index + 1}`;  // Link to the anchor for each chapter
        link.innerText = chapter.title;
        listItem.appendChild(link);
        toc.appendChild(listItem);
    });
    
    // Load the first chapter
    loadChapter(metadata.chapters[0].file, metadata.default_upvotes, 1);
}

async function loadChapter(chapterFile, defaultUpvotes, chapterIndex) {
    const chapter = await loadYAML(`source/${chapterFile}`);
    document.getElementById('chapter-title').innerHTML = `<h2 id="chapter-${chapterIndex}">${chapter.title}</h2>`;
    renderThread(chapter.thread);
    renderComments(chapter.comments, defaultUpvotes);
}

function renderThread(thread) {
    const threadHTML = `
        <div class="thread">
            <h3>${thread.title}</h3>
            <p><strong>u/${thread.author}</strong> - ${thread.posted}</p>
            <p>${thread.content}</p>
        </div>
    `;
    document.getElementById('thread-content').innerHTML = threadHTML;
}

function renderComments(comments, defaultUpvotes) {
    let commentsHTML = "<h3>Comments</h3>";
    comments.forEach(comment => {
        // Use default upvotes if none is provided in the comment data
        const upvotes = comment.upvotes !== undefined ? comment.upvotes : defaultUpvotes;
        
        commentsHTML += `
            <div class="comment">
                <div class="vote-container">
                    <span class="upvote">▲</span>
                    <div>${upvotes}</div>
                    <span class="downvote">▼</span>
                </div>
                <div class="details">
                    <p><strong class="author">u/${comment.author}</strong> - ${comment.meta || ""}</p>
                    <p>${comment.content}</p>
                </div>
            </div>
        `;
    });
    document.getElementById('comments-section').innerHTML = commentsHTML;
}

// Load metadata and initial content on page load
loadMetadata();
