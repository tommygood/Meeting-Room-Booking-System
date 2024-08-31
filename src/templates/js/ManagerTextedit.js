const api_info = 'http://localhost:3000/api/info/';

  // get user info from ncu portal
async function getinfo(type){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const headers = urlParams.get('access_token')
    try {
      const response = await fetch(api_info+type,{ headers: { 'access_token': headers } });
      const data = await response.json();
      return data.result;
      } catch (error) {
      console.error("Error:", error);
    }
  }

async function setAccountName() {
    const account_type = await getinfo('accountName');
    document.getElementById("accountName").innerHTML += account_type;
  }
  setAccountName();



function saveContent() {
    var editor_content = quill.container.innerHTML ;
    console.log(editor_content);
}

//當頁按鈕變色
document.addEventListener("DOMContentLoaded",function(){
    document.getElementById('textedit').style.backgroundColor = 'rgba(253, 105, 89, 0.636)';
    document.getElementById('textedit').style.color= 'white';
})




const fontSizeArr = ['8px','9px','10px','12px','14px','16px','20px','24px','32px','42px','54px','68px','84px','98px'];
var Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr;
Quill.register(Size, true);
//quill texteditor
document.addEventListener("DOMContentLoaded", function() {
    const quiller = document.getElementById("quill");
    var toolbarOptions = [
        [{ 'size': fontSizeArr }],
        ['bold', 'italic', 'underline', 'strike'],      
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'font': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image'],
        [{ 'align': null}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
        ['clean']                                      
    ];
    const quill = new Quill( quiller, {
        theme: "snow", // 模板
        modules: {
            toolbar: toolbarOptions
        }
});
})




