let id_content = {}; // store the content of the block with the corresponding data-id if the block has an id
/**
 * Initialize the Editor
 */
const editor = new EditorJS({
    autofocus: true,
    tools: {
        image: {
            class: SimpleImage,
            config: {
                placeholder: 'Paste image URL'
            }
        }
    },
    data: {
        version: "2.19.0"
    }
});

// Wait for the editor to be initialized before setting the blocks
setTimeout(() => {
    setBlocks(editor);
}, "500");

// directly navigate to the link when clicked
// avoid anchor tag not working in editor.js div
document.addEventListener('click', function (event) {
    const target = event.target;

    // Check if the clicked element is an anchor tag
    if (target.tagName === 'A') {
        // Allow default behavior (navigation)
        window.location.href = target.href;
    }
});

async function getBlocksAndId(doc_name) {
    const res = await fetch(`/api/doc?doc_name=${doc_name}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    })
    const data = await res.json();
    return Object.keys(data).length == 0 ? false : {blocks: JSON.parse(data.data.blocks), id_content: JSON.parse(data.data.id_content)};
};

// restore the id back to the content of the block with the corresponding data-id
function restoreIdContent(old_id_content) {
    if (old_id_content == null || old_id_content == undefined) return;
    id_content = old_id_content;
    // get all edior blocks
    const all_divs = document.getElementsByClassName('ce-block');
    // put the id back to the block
    for (const [key, value] of Object.entries(old_id_content)) {
        // find all the div which have data-id atrribute equal to key
        for (let i = 0; i < all_divs.length; i++) {
            if (all_divs[i].getAttribute('data-id') == key) {
            const block = all_divs[i].getElementsByTagName('div')[0];
            block.id = value;
            }
        }
    }
}

// get doc name from query string
function getDocName() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('doc_name');
}

// Set the blocks in the editor
async function setBlocks() {
    const doc_name = getDocName();
    let data = await getBlocksAndId(doc_name);
    let blocks = data.blocks;
    let id_content = data.id_content;
    // If there are no blocks, set the default block content
    if (blocks == false || blocks == undefined) {
        alert(`The Doc named ${doc_name} is not found !`)
        blocks = [{
            type: "paragraph",
            data: {
                text: ""
            }
        }]
    }
    editor.render({blocks: blocks, version: "2.11.10"});
    // wait until div init done.
    setTimeout(() => {
        //editor.readOnly.toggle(); // this function temp not compatiable with image tool
        // restore id when readonly setting done
        setTimeout(() => {
            restoreIdContent(id_content);
        }, "100");
    }, "100");
};