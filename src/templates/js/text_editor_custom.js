let id_content = {}; // store the content of the block with the corresponding data-id if the block has an id
/**
 * Initialize the Editor
 */
const editor = new EditorJS({
    autofocus: true,
    tools: {
        image: {
        class: SimpleImage,
        inlineToolbar: true,
        config: {
            placeholder: 'Paste image URL'
        }
        }
    },
    data: {
        version: "2.11.10"
    }
});

// Wait for the editor to be initialized before setting the blocks
setTimeout(() => {
    initBlocks();
}, "500");

// Set the default blocks in the editor
async function initBlocks() {
    blocks = [{
        type: "paragraph",
        data: {
            text: "請在此輸入內容"
        }
    }]
    editor.render({blocks: blocks, version: "2.11.10"});
};

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

// Listen for keyup events to do some custom actions
document.addEventListener('keyup', (event) => {
  const editorInput = document.activeElement;
  // Only replace '- ' at the beginning of the input
  if (editorInput.textContent.startsWith('- ')) {
    changeHyphen(editorInput);
  }
  // If the input starts with '# ', set the id of the div element to the text content after the space
  else if (editorInput.textContent.startsWith('# ')) {
    setId(editorInput);
  }
});

// save data to the database when the save button is clicked
const saveButton = document.getElementById('save-button');

// saveButton.addEventListener('click', () => {
//     editor.save().then( savedData => {
//         const doc_name = prompt("請輸入文件名稱");
//         console.log(savedData.blocks);
//       // const blocks = getBlocksFromData(savedData.blocks);
//         // sendBlocksAndId(blocks, doc_name, id_content);
//     })
// })

// display all doc
async function getAllDoc() {
    const res = await fetch(`/api/doc/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await res.json();
    return data.data;
}

async function displayAllDoc() {
    const data = await getAllDoc();
    // put data into div
    const docList = document.getElementById('doc_list');
    for (let i = 0; i < data.length; i++) {
        const doc = document.createElement('li');
        doc.innerHTML = `<a href="/page/rules/demo?doc_name=${data[i].name}">${data[i].name}</a>`;
        docList.appendChild(doc);
    }
}

displayAllDoc();

function changeHyphen(editorInput) {
    // Save the caret position before modifying the text
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    // Modify the text content (replace '- ' with your desired character)
    editorInput.textContent = editorInput.textContent.replace('- ', '• ');
    // Restore the caret position after modifying the text
    const newRange = document.createRange();
    newRange.setStart(editorInput.childNodes[0], startOffset); // Adjust position after text modification
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
}

function setId(editorInput) {
    // set the id of this div element to the text content before the space
    const id = editorInput.textContent.split(' ')[1];
    editorInput.id = id;
    const data_id = editorInput.parentNode.parentNode.getAttribute('data-id');  
    id_content[data_id] = editorInput.textContent.split(' ')[1];
}

function getBlocksFromData(data) {
    blocks = [];
    for (let i = 0; i < data.length; i++) {
      blocks.push({data : data[i].data, type: data[i].type, id: data[i].id});
    }
    return blocks;
 }

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

/**
 * Add handler for the Save button
 */
// Send blocks to the backend
async function sendBlocksAndId(blocks, doc_name, id_content) {
    fetch('/api/doc', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({blocks: blocks, doc_name:doc_name, id_content:id_content}),
    }).then(async function(res) {
        console.log(res);
        
        if (res.status == 200) {
            res = await res.json();
            if (res.suc) {
                alert('文件已儲存');
                location.reload();
            }
            else {
                alert('文件儲存失敗');
            }
        }
        else {
            alert(`文件儲存失敗, status code : ${res.status}, status text : ${res.statusText}`);
        }
    })
    .catch(function(error) {
        console.log(error);
    })    
}