var list =[]//= [{"COMPANY_ID":10,"COMPANY_NAME":"Shopee","REPRESENTATIVE_NAME":"Thinh","REPRESENTATIVE_CMND":"123456789","REPRESENTATIVE_PHONE":"0123456789","REPRESENTATIVE_EMAIL":"abc@abc","REPRESENTATIVE":"Building","BUSINESS_MODEL":"Full","BUSINESS_TYPE":"Shopping"},{"COMPANY_ID":11,"COMPANY_NAME":"Lazada","REPRESENTATIVE_NAME":"Anh","REPRESENTATIVE_CMND":"123456788","REPRESENTATIVE_PHONE":"0123456788","REPRESENTATIVE_EMAIL":"abc@abc1","REPRESENTATIVE":"Building","BUSINESS_MODEL":"Full","BUSINESS_TYPE":"Shopping"},{"COMPANY_ID":12,"COMPANY_NAME":"Viettin","REPRESENTATIVE_NAME":"Binh","REPRESENTATIVE_CMND":"123456787","REPRESENTATIVE_PHONE":"0123456787","REPRESENTATIVE_EMAIL":"abc@abc2","REPRESENTATIVE":"Building","BUSINESS_MODEL":"Full","BUSINESS_TYPE":"Bank"},{"COMPANY_ID":13,"COMPANY_NAME":"Agri","REPRESENTATIVE_NAME":"Ngo","REPRESENTATIVE_CMND":"123456786","REPRESENTATIVE_PHONE":"0123456786","REPRESENTATIVE_EMAIL":"abc@abc3","REPRESENTATIVE":"Building","BUSINESS_MODEL":"Full","BUSINESS_TYPE":"Bank"},{"COMPANY_ID":14,"COMPANY_NAME":"Kichi","REPRESENTATIVE_NAME":"Ga","REPRESENTATIVE_CMND":"123456785","REPRESENTATIVE_PHONE":"0123456785","REPRESENTATIVE_EMAIL":"abc@abc4","REPRESENTATIVE":"Building","BUSINESS_MODEL":"Full","BUSINESS_TYPE":"Food"}]
var ip = 'http://192.168.137.1:3000/'
$( document ).ready(function() {
    get_table()
});
$('select').on('change', function() {
    cols = []
    $("#orderInput").val("")
    get_table()
});
function get_table(){

    $('.loader').css("display", "inline")
    $('.none-loader').css("display", "none")  
    body = {}
    body["table_name"]= document.getElementById("tableOption").value;
    value = document.getElementById("orderInput").value
    if (value == ""){
        body["data"] = ""
    }
    else{
        subbody = {}
        if (document.getElementById("tableOption").value == "product_service"){
            subbody["NAME"] = value
        }
        else{
            subbody[cols[1]] = value
        }
        body["data"] = subbody
    }
    
    
    var req = new XMLHttpRequest();

    console.log(body)
    req.open("POST", ip+"select");
    req.setRequestHeader("Access-Control-Allow-Origin", "*")
    req.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    req.setRequestHeader("Access-Control-Allow-Headers","X-PINGOTHER, Content-Type")
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log(JSON.stringify(body))
    req.send(JSON.stringify(body));
    req.onload = function () {
        console.log(req.status);
        console.log(JSON.parse(req.responseText));
        list = JSON.parse(req.responseText)[0] 
        get_data(list)
        setTimeout(function(){ hide_loader(); } , 1000);
    };
} 

function hide_loader(){
    $('.loader').css("display", "none")
    $('.none-loader').css("display", "inline")
}
var cols = []; 
var modal = document.getElementById("myModal");
var input_modal = document.getElementById("inputModal")
var cancel_btn = document.getElementById("cancelBtn")
var span = document.getElementsByClassName("close")[0];
var up_add_span = document.getElementsByClassName("close")[1];
cancel_btn.onclick = () => {
    input_modal.style.display = "none";
    inputsub1 = document.getElementById("inputsub1");
    inputsub2 =  document.getElementById("inputsub2");
    inputsub1.innerHTML =""
    inputsub2.innerHTML =""
}
up_add_span.onclick = function(){
    input_modal.style.display = "none";
    inputsub1 = document.getElementById("inputsub1");
    inputsub2 =  document.getElementById("inputsub2");
    inputsub1.innerHTML =""
    inputsub2.innerHTML =""
}

span.onclick = function() {
    modal.style.display = "none";
    sub1 = document.getElementById("sub1");
    sub2 =  document.getElementById("sub2");
    sub1.innerHTML =""
    sub2.innerHTML =""
}
function send_data(value){
    body = {}
    body["table_name"]= document.getElementById("tableOption").value;
    subbody = {}
    for (var j = 0; j < cols.length; j++){
        if (j == 0 & value.value == "insert"){
            if (!(document.getElementById("tableOption").value == "member_customer" || document.getElementById("tableOption").value == "employee"))
                continue
        }
        input_val = $("#"+cols[j])
        subbody[input_val.attr('id')] = input_val.val()
    }
    body["data"] = subbody
    console.log(body)
    var req = new XMLHttpRequest();
    req.open("POST", ip+value.value);
    req.setRequestHeader("Access-Control-Allow-Origin", "*")
    req.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    req.setRequestHeader("Access-Control-Allow-Headers","X-PINGOTHER, Content-Type")
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log(JSON.stringify(body))
    req.send(JSON.stringify(body));
    req.onload = function () {
        console.log(req.status)
        if (req.status == 200){
            alert("Thành Công")
        }
        else{
            alert("Đã xảy ra lỗi vui lòng thử lại")
        }
    };
}
function detail_input(value){
    routes = value.name
    $("#confirmBtn").val(routes)
    
    //console.log(routes)
    var id;
    if (routes == "update"){
        id = value.value
        modal.style.display = "none";
        sub1 = document.getElementById("sub1");
        sub2 =  document.getElementById("sub2");
        sub1.innerHTML =""
        sub2.innerHTML =""
    }
    else {
        id = list[0][cols[0]]
    }
    //console.log(id)
    sub1 = document.getElementById("inputsub1");
    sub2 =  document.getElementById("inputsub2");
    for (var i = 0; i < list.length; i++){
        if (id == list[i][cols[0]]){
            modal.style.display = "none";
            input_modal.style.display = "block";
            for (var j = 0; j < cols.length; j++) { 
                var cell = document.createElement("div")
                span_tag = document.createElement("span")
                detail = document.createElement("input")
                if (j == 0){
                    detail.disabled = true
                    if(routes != "update"){
                        if (!(document.getElementById("tableOption").value == "member_customer" || document.getElementById("tableOption").value == "employee"))
                            continue
                        else{
                            detail.disabled = false
                        }
                    }
                }
                span_tag.className = "span-header"
                span_tag.innerHTML = cols[j] + ":   "
                cell.className = "detail-input-container"
                detail.className = "detail"
                if (routes == "update"){
                    detail.value = list[i][cols[j]]
                }
                detail.id = cols[j]
                //console.log(span_tag + list[i][cols[j]])
                cell.appendChild(span_tag)
                cell.appendChild(detail)
                // Inserting the cell at particular place 
                if (j % 2 == 0){
                    sub1.appendChild(cell)
                }
                else {
                    sub2.appendChild(cell)
                }

            } 
        }
    }
    
}
function delete_row(value){
    body = {}
    body["table_name"]= document.getElementById("tableOption").value;
    subbody = {}
    subbody[cols[0]] = value.value
    body["data"] = subbody
    console.log(body)
    var req = new XMLHttpRequest();
    req.open("POST", ip+"delete");
    req.setRequestHeader("Access-Control-Allow-Origin", "*")
    req.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    req.setRequestHeader("Access-Control-Allow-Headers","X-PINGOTHER, Content-Type")
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log(JSON.stringify(body))
    req.send(JSON.stringify(body));
    req.onload = function () {
        console.log(req.status)
        if (req.status == 200){
            alert("Thành Công")
        }
        else{
            alert("Đã xảy ra lỗi vui lòng thử lại")
        }
    };
}
function set_extra_table(table_data){
    table_cols =[]
    for (var i = 0; i < table_data.length; i++) { 
        for (var k in table_data[i]) { 
            if (table_cols.indexOf(k) === -1) { 
                    
                // Push all keys to the array 
                table_cols.push(k); 
            } 
        } 
    } 
    var table = document.createElement("table"); 
                
    // Create table row tr element of a table 
    var tr = table.insertRow(-1); 
        
    for (var i = 0; i < table_cols.length; i++) { 
            
        // Create the table header th element 
        var theader = document.createElement("th"); 
        theader.innerHTML = table_cols[i]; 
            
        // Append columnName to the table row 
        tr.appendChild(theader); 
    } 
        
    // Adding the data to the table 
    for (var i = 0; i < table_data.length; i++) { 
            
        // Create a new row 
        trow = table.insertRow(-1); 
        for (var j = 0; j < table_cols.length; j++) { 
            var cell = trow.insertCell(-1); 
                
            // Inserting the cell at particular place 
            cell.innerHTML = table_data[i][table_cols[j]]; 
        } 
    } 
    
    // Add the newely created table containing json data 
    var el = document.getElementById("table-detail"); 
    el.innerHTML = ""; 
    el.appendChild(table);
}
function get_extra_details(id, id2){
    body = {}
    body["table_name"]= document.getElementById("tableOption").value;
    subbody = {}      
    if (id2 != 0){
        subbody["ID2"] = id2
    }          
    subbody["ID"] = id
    body["data"] = subbody
    console.log(body)
    var req = new XMLHttpRequest();
    req.open("POST", ip+"extra");
    req.setRequestHeader("Access-Control-Allow-Origin", "*")
    req.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    req.setRequestHeader("Access-Control-Allow-Headers","X-PINGOTHER, Content-Type")
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log(JSON.stringify(body))
    req.send(JSON.stringify(body));
    req.onload = function () {
        //console.log(req.responseText);
        table_data = JSON.parse(req.responseText)[0] 
        set_extra_table(table_data)
    };
    
}
// Get the button that opens the modal
function show_details(value){
    id = value.children[0].innerHTML
    sub1 = document.getElementById("sub1");
    sub2 =  document.getElementById("sub2");
    $("#updateBtn").val(id)
    $("#deleteBtn").val(id)
    for (var i = 0; i < list.length; i++){
        if (id == list[i][cols[0]]){
            modal.style.display = "block";
            for (var j = 0; j < cols.length; j++) { 
                var cell = document.createElement("div")
                span_tag = document.createElement("span")
                detail = document.createElement("span")
                span_tag.className = "span-header"
                span_tag.innerHTML = cols[j] + ":   "
                cell.className = "detail-container"
                detail.className = "detail"
                detail.innerHTML = list[i][cols[j]]
                //console.log(span_tag + list[i][cols[j]])
                cell.appendChild(span_tag)
                cell.appendChild(detail)
                // Inserting the cell at particular place 
                if (j % 2 == 0){
                    sub1.appendChild(cell)
                }
                else {
                    sub2.appendChild(cell)
                }

            } 
            query = cols[0]
            query1 = 0
            if (document.getElementById("tableOption").value == "employee")
            {
                query = cols[7]
            }    
            else if (document.getElementById("tableOption").value == "product_service"){
                query1 = list[i][cols[1]]
            }
            get_extra_details(list[i][query], query1)
            // Create a table element 
        }
    }
      
}

function get_data(list){
    for (var i = 0; i < list.length; i++) { 
        for (var k in list[i]) { 
            if (cols.indexOf(k) === -1) { 
                // Push all keys to the array 
                cols.push(k); 
            } 
        } 
    }  
    // Create a table element 
    table = document.createElement("table"); 
        
    // Create table row tr element of a table 
    tr = table.insertRow(-1); 
        
    for (var i = 0; i < cols.length; i++) { 
            
        // Create the table header th element 
        var theader = document.createElement("th"); 
        theader.innerHTML = cols[i]; 
            
        // Append columnName to the table row 
        tr.appendChild(theader); 
    } 
        
    // Adding the data to the table 
    for (var i = 0; i < list.length; i++) { 
            
        // Create a new row 
        trow = table.insertRow(-1); 
        for (var j = 0; j < cols.length; j++) { 
            cell = trow.insertCell(-1); 
                
            // Inserting the cell at particular place 
            cell.innerHTML = list[i][cols[j]]; 
        } 
        cell = trow.insertCell(-1);
        button_more = document.createElement("button")
        button_more.innerHTML = "More"
        button_more.className = "tracking-btn"
        button_more.onclick = (function(trow) {return function() {show_details(trow);}})(trow);
        cell.appendChild(button_more)
    } 
    
    // Add the newely created table containing json data 
    var el = document.getElementById("table"); 
    el.innerHTML = ""; 
    el.appendChild(table);
}



window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        sub1 = document.getElementById("sub1");
        sub2 =  document.getElementById("sub2");
        sub1.innerHTML =""
        sub2.innerHTML =""
    }
    else if(event.target == input_modal){
        input_modal.style.display = "none";
        inputsub1 = document.getElementById("inputsub1");
        inputsub2 =  document.getElementById("inputsub2");
        inputsub1.innerHTML =""
        inputsub2.innerHTML =""
    }
}

