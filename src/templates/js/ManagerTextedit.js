const api_info = '/api/info/';

  // get user info from ncu portal
async function getinfo(type){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const headers = urlParams.get('access_token')
    try {
      const response = await fetch(api_info+type,{ headers: { 'access_token': headers } });
      const data = await response.json();
      return data.data;
      } catch (error) {
      console.error("Error:", error);
    }
  }

async function setAccountName() {
    const account_type = await getinfo('chinesename');
    document.getElementById("accountName").innerHTML += account_type;
  }
  setAccountName();



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
//當頁按鈕變色
document.addEventListener("DOMContentLoaded",function(){
    document.getElementById('rules').style.backgroundColor = 'rgba(253, 105, 89, 0.636)';
    document.getElementById('rules').style.color= 'white';
})

//換頁
function changePage(button){
  location.href = "/page/"+button.id;
}


const fontSizeArr = ['8px','9px','10px','12px','14px','16px','20px','24px','32px','42px','54px','68px','84px','98px'];
var Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr;
Quill.register(Size, true);
var fonts = ['Microsoft-JhengHei','Arial','Times-New-Roman','sans-serif'];  
var Font = Quill.import('formats/font');  
Font.whitelist = fonts; //将字体加入到白名单 
Quill.register(Font, true);

document.addEventListener("DOMContentLoaded", function() {
    const quiller = document.getElementById("quill");
    const saveButton = document.getElementById("save-button");

    var toolbarOptions = [
        [{ 'size':fontSizeArr }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'font': Font.whitelist }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image'],
        [{ 'align': null }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
        ['clean']
    ];
    const quill = new Quill(quiller, {
        theme: "snow", // 模板
        modules: {
            toolbar: toolbarOptions
        }
    });
    saveButton.addEventListener('click', function() {
      // 使用 quill.root.innerHTML 獲取編輯器的 HTML 內容
      saveEditorContent(quill);
    });
});

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}
function saveEditorContent(quill) {
    const delta = quill.getContents();
    let customJson = [];
    let paragraphBuffer = "";
    let paragraphId = generateUniqueId();  

    delta.ops.forEach((op) => {
        if (op.insert && typeof op.insert === 'string') {
            let lines = op.insert.split('\n');
            lines.forEach((line, lineIndex) => {
                if (line.trim() !== "") {
                    let formattedText = line;

                    if (op.attributes) {
                        if (op.attributes.bold) {
                            formattedText = `<strong>${formattedText}</strong>`;
                        }
                        if (op.attributes.italic) {
                            formattedText = `<em>${formattedText}</em>`;
                        }
                        if (op.attributes.underline) {
                            formattedText = `<u>${formattedText}</u>`;
                        }
                        if (op.attributes.strike) {
                            formattedText = `<s>${formattedText}</s>`;
                        }
                        if (op.attributes.color) {
                            formattedText = `<span style="color: ${op.attributes.color};">${formattedText}</span>`;
                        }
                        if (op.attributes.background) {
                            formattedText = `<span style="background-color: ${op.attributes.background};">${formattedText}</span>`;
                        }
                        if (op.attributes.size) {
                            formattedText = `<span style="font-size: ${op.attributes.size};">${formattedText}</span>`;
                        }
                        if (op.attributes.font) {
                            formattedText = `<span style="font-family: ${op.attributes.font};">${formattedText}</span>`;
                        }
                        if (op.attributes.link) {
                            formattedText = `<a href="${op.attributes.link}" target="_blank">${formattedText}</a>`;
                        }
                    }

                    paragraphBuffer += formattedText; 
                }

                if (lineIndex < lines.length - 1) {
                    if (paragraphBuffer.trim() !== "") {
                        let alignedParagraph = paragraphBuffer.trim();

                        // 如果有對齊屬性，包裹相應的 div 並設置對齊方式
                        if (op.attributes && op.attributes.align) {
                            alignedParagraph = `<div style="text-align: ${op.attributes.align};">${alignedParagraph}</div>`;
                        }

                        customJson.push({
                            id: paragraphId,
                            type: "paragraph",
                            data: {
                                text: alignedParagraph
                            }
                        });
                    }
                    // 重置緩衝區並為下一段生成新的 ID
                    paragraphBuffer = "";
                    paragraphId = generateUniqueId();
                }
            });
        } else if (op.insert && typeof op.insert === 'object' && op.insert.image) {
            // 如果當前段落緩衝區不為空，先保存當前段落
            if (paragraphBuffer.trim() !== "") {
                let alignedParagraph = paragraphBuffer.trim();

                // 如果有對齊屬性，包裹相應的 div 並設置對齊方式
                if (op.attributes && op.attributes.align) {
                    alignedParagraph = `<div style="text-align: ${op.attributes.align};">${alignedParagraph}</div>`;
                }

                customJson.push({
                    id: paragraphId,
                    type: "paragraph",
                    data: {
                        text: alignedParagraph
                    }
                });
                paragraphBuffer = "";
                paragraphId = generateUniqueId();
            }

            // 保存圖像塊
            customJson.push({
                id: generateUniqueId(),
                type: "image",
                data: {
                    url: op.insert.image
                }
            });
        }
    });

    if (paragraphBuffer.trim() !== "") {
        let alignedParagraph = paragraphBuffer.trim();

        if (delta.ops[delta.ops.length - 1].attributes && delta.ops[delta.ops.length - 1].attributes.align) {
            alignedParagraph = `<div style="text-align: ${delta.ops[delta.ops.length - 1].attributes.align};">${alignedParagraph}</div>`;
        }

        customJson.push({
            id: paragraphId,
            type: "paragraph",
            data: {
                text: alignedParagraph
            }
        });
    }

    const doc_name = prompt("請輸入文件名稱");
    sendBlocksAndId(customJson,doc_name); }

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

document.addEventListener("DOMContentLoaded", function() {
    document.body.addEventListener('click', function(event) {
        const target = event.target;

        if (target.closest('.ql-action') && (target.tagName === 'BUTTON' || target.tagName === 'A')) {
            event.preventDefault(); 
        }
    });
});