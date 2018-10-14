//JAVASCRIPT
window.onload=function(){

//	localStorage.removeItem('value', null); return;
       // clearContatos();
    listar();
    adicionarTelefone();

    document.getElementById('frmCadastro').addEventListener('submit', adicionarOuAlterar);
    document.getElementById('frmCadastro').addEventListener('submit', listar);
}

var idAlterar = null;
var telefoneCounter=0;

function getContatos() {
	return JSON.parse(localStorage.getItem('contatos'));
}

function setContatos(contatos) {
	localStorage.setItem('contatos', JSON.stringify(contatos));
}

function clearContatos() {
	window.localStorage.removeItem('contatos');
}

function adicionarOuAlterar(e){
    e.preventDefault();

    var nom         = document.getElementById('txtNome').value;
    var rua         = document.getElementById('txtRua').value;
    var numero      = document.getElementById('txtNumero').value;
    var complemento = document.getElementById('txtComplemento').value;
    var cep         = document.getElementById('txtCep').value;
    var bairro      = document.getElementById('txtBairro').value;
    var cidade      = document.getElementById('txtCidade').value;
    var uf          = document.getElementById('txtUF').value;

    var numeroTel    = document.getElementById('txtNumeroTelefone');
    var tipoTelefone = document.getElementById('txtNomeTelefone');

    var telefones	 = getTelefonesArray();
    
    var c = {
        nome        : !nom ? "sem nome": nom,
        
        nasc        : new Date(document.getElementById('dtpDataNascimento').value.replace("-","/")).toLocaleString("pt-BR").substring(0, 10),
        rua         : !rua ? "rua não informada" : rua,
        numero      : !numero ? "numero não informada" : numero,
        complemento : !complemento ? "comp não informada" : complemento,
        cep         : !cep ? "cep não informada" : cep,
        bairro      : !bairro ? "bairro não informada" : bairro,
        cidade      : !cidade ? "cidade não informada" : cidade,
        uf          : !uf ? "uf não informada" : uf,
        telefones	: telefones,
        data		: new Date(),
        ativo 		: 1
    };
    
    //var nasc = c.nasc.getFullYear() + '-' + c.nasc.getFullMonth() + '' + 
    //console.log(c.nasc.toLocaleString());
    //return false;

    if(idAlterar == null)   
        adicionar(c);
    else if(idAlterar > 0)
        alterar(c);
    else
        alert("Ação desconhecida"); 
    
    //bloqueia a ação de atualização do browser
    return false;
}                   

function limparFormulario() {
    document.getElementById("novoTelefone").innerHTML = '';
    telefoneCounter=0;      
}

function adicionar(contato){  
	var contatos = getContatos() || [];

	//console.log(contatos);
	
    contato.id = contatos.length+1;
	//console.log(contatos);
	
    //Adiciona o objeto ao ultimo indice do array
    contatos.push(contato);   

    //Ordeno o array pelo ID do objeto
    contatos.sort(function(a,b) {
        return a.Id - b.Id;
    });         
    
    //armazena no Localstorage
    setContatos(contatos)
    //reseta os campos do formulario
    //document.getElementById('frmCadastro').reset(); 
}

function alterar(contato){
    var btn = document.getElementById('btnCadastrarSalvar');    

    var contatos = getContatos();
	var index = getIndexByID(idAlterar);
	
	if (index<0) 
		return alert('ID n�o encontrado ' + idAlterar);
	
	contato.id = idAlterar;
	contatos[index] = contato;

    btn.value = "Cadastrar";
    idAlterar = null;

    setContatos(contatos); 
    limparFormulario();
    adicionarTelefone();
    document.getElementById('frmCadastro').reset();
}

//função do botao Alterar
function prepararAlterar(idRow){    
    document.getElementById('btnCadastrarSalvar').value = "Salvar";
    
    var txtNome = document.getElementById('txtNome'),
        dtpDataNascimento = document.getElementById('dtpDataNascimento'),
        rdoMasculino = document.getElementById('rdoMasculino'),
        rdoFeminino = document.getElementById('rdoFeminino');
    

    var 
    	contatos = getContatos(),
    	index	 = getIndexByID(idRow),
    	contato  = contatos[index];

        txtNome.value = contato.nome;
        dtpDataNascimento.value = contato.nasc.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1'); //caso fosse tipo date toISOString().substring(0, 10);
            
        //recarrega a lista para limpar o th com background alterado
        listar();
        //return false;

        //coloco ID null (caso clicar em varios botao alterar)
        //idAlterar = null;
        var th = document.getElementById("rowTable"+idRow);
        th.className = "estadoAlteracao";               

		limparFormulario();

		for(var t = 0; t < contato.telefones.length; t++){
    		var telefone = contato.telefones[t];
    		adicionarTelefone(telefone.tipo, telefone.telefone, telefone.ativo);
		}
		
        //atribuir o Id a variavel global
        idAlterar = contato.id;
}

function getIndexByID(id){
    var contatos = getContatos();

    for(var i = 0; i < contatos.length; i++)
        if(contatos[i].id == id)
        	return i;
    
    return -1;
}

function excluir(id){
    var contatos = getContatos();
	var index = getIndexByID(id);

	contatos[index].ativo = 0;
    //contatos.splice(index, 1);

    setContatos(contatos); 
    listar();
    
    //se nao possuir mais nenhum registro, limpar o storage
    if(contatos.length == 0)
        clearContatos();
}

function listar(){
    //se nao possuir nenhum local storage, nao fazer nada
    if(getContatos() === null)
        return;
    
    //captura os objetos de volta
    var contatos		= getContatos();
    var tbody			= document.getElementById("tbodyResultados");

    //limpar o body toda vez que atualizar
    tbody.innerHTML = '';
    
    
    console.log(contatos);
    for(var i = 0; i < contatos.length; i++){
    	var contato = contatos[i];                                                  
    	if (contato.ativo==0) 
    		continue;
    	
    	var telefonesHtml = '';
                   
	    for(var t = 0; t < contato.telefones.length; t++){
    		var telefone = contato.telefones[t];
    		if (telefone.ativo==0) continue;
    		telefonesHtml +=  '<li>'+telefone.telefone + '('+telefone.tipo+')';
		}
		
        tbody.innerHTML += '<tr id="rowTable'+contato.id+'">'+
                                '<td>'+contato.id+'</td>'+
                                '<td>'+contato.nome+'</td>'+
                                '<td>'+contato.nasc+'</td>'+
                                '<td>'+contato.rua+'</td>'+
                                '<td>'+contato.numero+'</td>'+
                                '<td>'+contato.complemento+'</td>'+
                                '<td>'+contato.cep+'</td>'+
                                '<td>'+contato.bairro+'</td>'+
                                '<td>'+contato.cidade+'</td>'+
                                '<td>'+contato.uf+'</td>'+
                                '<td>'+telefonesHtml+'</td>'+           
                                '<td><button onclick="excluir(\'' + contato.id + '\')">Excluir</button></td>'+
                                '<td><button onclick="prepararAlterar(\'' + contato.id + '\')">Alterar</button></td>'+
                           '</tr>';     
    }
}
                            
function removerTelefone(id){
	var element = document.getElementById(id);	
	///element.querySelector('.telefoneativo').value = 0;
	//if (element) element.remove();
	
	document.getElementById("novoTelefone").removeChild(element);
	return false;
}

function adicionarTelefone(tipo, telefone, ativo) {
	var 
		div			= document.createElement('DIV'),
		container	= document.getElementById("novoTelefone");

	div.className = 'registrotelefone';	
	div.id = 'registrotelefone '+(telefoneCounter++);
	var id = container.childNodes.length; 
	//div.title = id;	
	
	//Manter o todo o conte�do do html dentro de um div class=box-item
	div.innerHTML = '<div class="box-item">'+
                    '<input type="checkbox" id="telefoneativo" value=1 class="telefoneativo" '+(ativo==0 ? '' : 'checked')+'><label for="telefoneativo">Ativo</label><BR>'+
					'<label for="txtNumeroTelefone">Tipo Telefone</label>'+
                    '<select class="tipoTelefone" name="tipoTelefone">'+
                        '<option value="Comercial" '+(tipo=='Comercial' ? 'selected' : '')+'>Comercial</option>'+
                        '<option value="Residencial" '+(tipo=='Residencial' ? 'selected' : '')+'>Residencial</option>'+
                        '<option value="Celular" '+(tipo=='Celular' ? 'selected' : '')+'>Celular</option>'+
                    '</select>'+
                    '<label for="txtNomeTelefone">Numero</label>'+
                    '<input type="text" class="telefone" placeholder="Telefone" value='+(telefone ? telefone : '')+'><button onclick="return removerTelefone(\''+div.id+'\')" >Remover</button>'+
                    '</div>';

    container.appendChild(div);
    //alert(document.);
    
    return false;
}

function getTelefonesArray() {
   	var 
		container	= document.getElementById("novoTelefone"),
	   	lista		= container.querySelectorAll(".registrotelefone"),
   		result		= [];
   		
    for (var i=0; i<lista.length; i++) {
    	var registro = lista[i];
    	//console.log('I:'+i + ' name'+value.tagName);
    	tipo	= registro.querySelector('.tipoTelefone').value;
    	telefone= registro.querySelector('.telefone').value;
    	ativo	= registro.querySelector('.telefoneativo').checked ? 1 : 0;
    	result.push({tipo:tipo, telefone:telefone, ativo:ativo});
    }
   // console.log(result);
    return result;
}

