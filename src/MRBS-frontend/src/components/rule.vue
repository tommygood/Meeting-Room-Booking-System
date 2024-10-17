<template>
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <link href="https://cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet">
    <user_header :set-info="setInfo" :info="info" v-if="!demo"></user_header>
    <div class="test" style='height: 83vh;width:98vw;'>
        <root_menu :set-page-name="setPageName" v-if="!demo"></root_menu>
        <div style='display:flex;flex-direction: column;width:100%;'>
            <h1 style='margin-left:2%;width:100%;' v-if="!demo">
                [ {{ page_name }} ]
                <button id="save-button" class='fancy' style="position: absolute; width: 8%;margin-left:2%" v-show="!demo">存檔</button>

            </h1>
            <div class='rule-box' style='width:100%;height:100%'>
                <div id="quill" style="width:100%;height:100%;overflow-y: scroll; border: 1px solid black;border-radius: 10px; margin: 0 auto ;background-color:white;"></div>
            </div>
        </div>
    </div>
    
</template>
<script>
import root_menu from '@/components/rootMenu.vue';
import user_header from '@/components/header.vue';
import config from '@/config';
export default {
    name: 'rule',
    components: {
        root_menu,
        user_header,
    },
    data() {
        return {
            info: {},
        }
    },
    props: {
        demo: {
            type: Boolean,
            default: false
        },
    },
    async mounted() {
        await this.loadCDN([
            'https://cdn.quilljs.com/1.3.6/quill.js', 
            'https://cdn.quilljs.com/1.3.6/quill.min.js',
            'https://cdn.jsdelivr.net/npm/quill-image-resize-module@3.0.0/image-resize.min.js'
        ]);

        document.body.addEventListener('click', function(event) {
            const target = event.target;

            if (target.closest('.ql-action') && (target.tagName === 'BUTTON' || target.tagName === 'A')) {
                event.preventDefault(); 
            }
        });
        this.loadRuleContent();
    },
    methods: {
        setPageName(val) {
            this.page_name = val;
        },
        setInfo(info) {
            this.info = info;
        },
        async loadCDN(cdn) {
            // load required cdn, and wait for all cdn to be loaded
            await Promise.all(cdn.map(src => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }));
        },
        getDocName() {
            // get doc_name from url path rather than query string
            // if path not equal 'demo'
            const path = window.location.pathname;
            const pathArr = path.split('/');
            let doc_name = pathArr[pathArr.length - 1];
            if (doc_name == 'demo') {
                // get doc_name from query string
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                doc_name = urlParams.get('doc_name');
            }
            return doc_name;
        },
        async getBlocksAndId() {
            const api = config.apiUrl + `/doc?doc_name=${this.getDocName()}`;
            const res = await fetch(api, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            })
            const data = await res.json();
            return Object.keys(data).length == 0 ? false : {blocks: JSON.parse(data.data.blocks), id_content: JSON.parse(data.data.id_content)};
        },
        convertBlocks(blocks, quill) {
            blocks.forEach(block => {
                if (block.type === 'paragraph' && block.data && block.data.text) {
                    quill.clipboard.dangerouslyPasteHTML(quill.getLength(), block.data.text);
                } else if (block.type === 'image') {
                    // 使用 Delta 插入圖片，這樣 Quill 可以完整地管理圖片
                    const index = quill.getLength(); // 獲取插入位置
                    quill.insertEmbed(index, 'image', block.data.url);
                    
                    // 使用 Delta 的方式來設置寬高
                    quill.formatText(index, 1, {
                        width: block.data.width ? `${block.data.width}` : 'auto',
                    });
                }
            });
        },
        async loadRuleContent() {
            const fontSizeArr = ['8px','9px','10px','12px','14px','16px','20px','24px','32px','42px','54px','68px','84px','98px'];
            var Size = Quill.import('attributors/style/size');
            Size.whitelist = fontSizeArr;
            Quill.register(Size, true);
            var fonts = ['Microsoft-JhengHei','Arial','Times-New-Roman','sans-serif'];  
            var Font = Quill.import('formats/font');  
            Font.whitelist = fonts; //将字体加入到白名单 
            Quill.register(Font, true);

            const content = await this.getBlocksAndId();
            const quiller = document.getElementById("quill");
            const saveButton = document.getElementById("save-button");

            let toolbarOptions;
            // 如果是 demo 頁面，不顯示 toolbar
            if (this.demo) {
                toolbarOptions = null;
                document.getElementsByClassName("rule-box")[0].style.width = "100%";
                document.getElementsByClassName("rule-box")[0].style.height = "100%";
            }
            else {
                toolbarOptions = [
                    [{ 'size':fontSizeArr }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'font': Font.whitelist }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['link', 'image'],
                    [{ 'align': null }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
                    ['clean']
                ];
            }
            try {
                const quill = new Quill(quiller, {
                    theme: "snow", // 模板
                    modules: {
                        toolbar: toolbarOptions,
                        imageResize: {
                            modules: [ 'Resize' ,'DisplaySize']  // 只保留 Resize 模塊，去除 Alignment 模塊
                        }
                    }
                });
                if (content) {
                    this.convertBlocks(content.blocks,quill);
                }
                saveButton.addEventListener('click', () => {
                    // 使用 quill.root.innerHTML 獲取編輯器的 HTML 內容
                    this.saveEditorContent(quill);
                });
            }
            catch (error) {
                console.error(error);
                if (error.message.includes('is not a constructor')) {
                    location.reload(); // try to reload the page if imageResize error occurs
                }
            }
        },
        generateUniqueId() {
            return Math.random().toString(36).substr(2, 9);
        },
        saveEditorContent(quill) {
            const delta = quill.getContents();
            let customJson = [];
            let paragraphBuffer = "";
            let paragraphId = this.generateUniqueId();  

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
                                    alignedParagraph = `<p style="text-align: ${op.attributes.align};">${alignedParagraph}</p>`;
                                }

                                customJson.push({
                                    id: paragraphId,
                                    type: "paragraph",
                                    data: {
                                        text: alignedParagraph
                                    }
                                });
                            }
                            paragraphBuffer = "";
                            paragraphId = this.generateUniqueId();
                        }
                    });
                } else if (op.insert && typeof op.insert === 'object' && op.insert.image) {

                    const img = document.querySelector(`img[src="${op.insert.image}"]`);
                    let width = null;

                    if (img) {
                        width = img.style.width || img.getAttribute('width') || img.naturalWidth;

                        // 確保 width 是字符串，並且沒有重複添加 "px"
                        if (typeof width === 'number') {
                            // 當寬度是數值時，添加單位
                            width = width + "px";
                        } else if (typeof width === 'string' && !width.includes('px') && !width.includes('%')) {
                            // 當 width 是字符串但不包含 "px" 或 "%" 時，添加單位
                            width += "px";
                        }
                    
                        console.log(width); // 應該輸出最終的寬度值，且只有一個 "px"
                    }

                    if (paragraphBuffer.trim() !== "") {
                        let alignedParagraph = paragraphBuffer.trim();

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
                        paragraphId = this.generateUniqueId();
                    }

                    customJson.push({
                        id: this.generateUniqueId(),
                        type: "image",
                        data: {
                            url: op.insert.image,
                            width: width,
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
            // const doc_name = prompt("請輸入文件名稱");
            this.sendBlocksAndId(customJson, this.getDocName()); 
        },
        async sendBlocksAndId(blocks, doc_name, id_content) {
            const api = config.apiUrl + '/doc';
            fetch(api, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({blocks: blocks, doc_name:doc_name, id_content:id_content}),
                credentials: 'include',
            }).then(async function(res) {
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
        },

    },
}
</script>
<style scoped>
.test {
    display: inline-flex;
    background-color:#DDD;
}
.rule-box {
    display: inline-flex;
    width:70%;
    flex-direction: column;
    background-color:#DDD;
    flex-direction: flex-end;
}
.ql-toolbar {
    background-color: #fff;
    width: fit-content;
    border-right: 2px solid #000000;
}
</style>
<style scoped>
/* 右半邊 */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin-top: 30px;
}
.ql-editor{
    margin-top: 1%;
    background-color: #fff;
    height:84vh;
    width:100%;
    overflow:visible !important;
    word-break: break-word; 

}
.ql-container.ql-snow {
    height: auto;
}

.ql-tooltip {
    left: unset !important;  
}

/* 字體名稱 */
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Microsoft-JhengHei"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Microsoft-JhengHei"]::before {
    content: "微軟正黑體";
    font-family: "Microsoft-JhengHei";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Arial]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Arial]::before {
    content: "Arial";
    font-family: "Arial";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Times-New-Roman]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Times-New-Roman]::before {
    content: "Times New Roman";
    font-family: "Times New Roman";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=sans-serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=sans-serif]::before {
    content: "sans-serif";
    font-family: "sans-serif";
}
 
.ql-font-Microsoft-JhengHei {
      font-family: "Microsoft YaHei";
}

.ql-font-Arial {
      font-family: "Arial";
}
.ql-font-Times-New-Roman {
      font-family: "Times New Roman";
}
.ql-font-sans-serif {
      font-family: "sans-serif";
}
/* 幾px */
.ql-picker.ql-size .ql-picker-label::before,
.ql-picker.ql-size .ql-picker-item::before {
	content: attr(data-value) !important;
}

.save-button{
    position:absolute;
    display:flex;
    align-items: center;
    justify-content: center;
    background-color: #8F8E8E;
    border-radius: 10px;
    width: 100px;
    height: 41.6px;
    margin-left: 780px;
    cursor: pointer;
    
}
.save-button:hover{
    background-color:#9F9E9E;
    cursor: pointer; 

  }
.buttontext{
    font: 700 24px/1.2 Inter, Helvetica, Arial, serif;
    color:#DDD
}


/* 使用者/管理者按鈕 */
.useradmin{
    position:absolute ;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    border:1px black solid;
    width: fit-content;
    height:40px;
    margin-top: 10px;
    margin-left:85%;
  }
  
.useradmin-button{
    width: 40px;
    height: 40px;
    padding-left: 10px;
    padding-right: 10px;

    background-repeat: no-repeat;
    background-size: cover;
    justify-content: center;
}
.useradmin-button:hover{
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
}
</style>