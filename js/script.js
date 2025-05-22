
const ano = document.getElementById('ano');
if(ano){
    ano.innerText = new Date().getFullYear();
}


let resultadoConsulta = null;
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;

const grid = document.getElementById('grid');
const pagination = document.getElementById('pagination');

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------


async function getTable(action) {

    try {

        const response = await fetch(`/api-proxy.php?action=${action}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "ok") {

            resultadoConsulta = data.resultado;
            filteredData = [...resultadoConsulta];

            renderGrid();

        } else {
            throw new Error(`${data.resultado}`);
        }

    } catch (error) {
        console.error("Erro na busca:", error);
        return [];
    }
}

async function getProjetosList() {

    try {

        const response = await fetch("/api-proxy.php?action=projetos", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "ok") {

            result = data.resultado;
            const data_array = [...result];
            buildSelectProjetos(data_array);

        } else {
            throw new Error(`${data.resultado}`);
        }

    } catch (error) {
        console.error("Erro na busca:", error);
        return [];
    }
}

async function getTarefasList(action) {

    try {

        const response = await fetch("/api-proxy.php?action=tarefas_2", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "ok") {

            resultadoConsulta = data.resultado;
            const data_array = [...resultadoConsulta];

            if (action && action == 'tasks') {
                filteredData = [...resultadoConsulta];
                buildTasksList();
            } else {
                return data_array;
            }

        } else {
            throw new Error(`${data.resultado}`);
        }

    } catch (error) {
        console.error("Erro na busca:", error);
        return [];
    }
}

async function postData(idDialog, action) {

    const form = document.getElementById(idDialog);
    const errorSpan = form.querySelector(".error span");

    const inputs = form.querySelectorAll("input[name], select[name], textarea[name]");

    const campos = [];
    const valores = [];

    let formValido = true;

    inputs.forEach(input => {

        if (input.classList.contains('ignore')) return;

        if (input.required && !input.value.trim()) {
            formValido = false;
        }

        campos.push(input.name);
        valores.push(input.value);
    });

    if (!formValido) {
        errorSpan.textContent = "Erro: Campos obrigatórios não informados!";
        errorSpan.style.color = "red";
        return;
    }

    try {

        const response = await fetch("/api-proxy.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action,
                campos,
                valores
            })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "ok") {

            inputs.forEach(input => input.value = "");
            errorSpan.textContent = "";

            form.close();
            getTable(action);

        } else {
            throw new Error(`${data.resultado}`);
        }

    } catch (error) {

        errorSpan.textContent = "Erro: " + error.message;
        errorSpan.style.color = "red";

    }
}

async function putData(idDialog, action) {

    const form = document.getElementById(idDialog);
    const errorSpan = form.querySelector(".error span");

    const inputs = form.querySelectorAll("input[name], select[name], textarea[name]");

    const campos = [];
    const valores = [];

    var id = '';
    let formValido = true;

    inputs.forEach(input => {

        if (input.readOnly) return;

        if (input.required && !input.value.trim()) {
            formValido = false;
        }

        if (input.type === "hidden") {
            id = input.value;
            return;
        }

        campos.push(input.name);
        valores.push(input.value);
    });

    if (!formValido) {
        errorSpan.textContent = "Erro: Campos obrigatórios não informados!";
        errorSpan.style.color = "red";
        return;
    }

    try {

        const response = await fetch("/api-proxy.php", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action,
                campos,
                valores,
                id
            })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "ok") {

            errorSpan.textContent = "";

            form.close();
            getTable(action);

        } else {
            throw new Error(`${data.resultado}`);
        }

    } catch (error) {

        errorSpan.textContent = "Erro: " + error.message;
        errorSpan.style.color = "red";

    }
}

async function deleteData(idDialog, action) {

    const form = document.getElementById(idDialog);
    const errorSpan = form.querySelector(".error span");

    const inputs = form.querySelectorAll("input");

    var id = '';

    inputs.forEach(input => {
        if (input.type === "hidden") {
            id = input.value;
            return;
        }
    });

    try {

        const response = await fetch("/api-proxy.php", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action,
                id
            })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "ok") {

            form.close();
            getTable(action);

        } else {
            throw new Error(`${data.resultado}`);
        }

    } catch (error) {
        errorSpan.textContent = "Erro: " + error.message;
        errorSpan.style.color = "red";
    }
}

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------


function renderGrid() {
    grid.innerHTML = '';

    if (filteredData.length == 0) {
        document.getElementById('tabela_result').classList.add('inactive');
        document.getElementById('error_get').classList.remove('inactive');
        renderPagination();
        return;
    } else {
        document.getElementById('tabela_result').classList.remove('inactive');
        document.getElementById('error_get').classList.add('inactive');
    }

    // Ordenar por data, se existir o campo 'service_at'
    if (filteredData.length > 0 && filteredData[0].service_at) {
        filteredData.sort((a, b) => new Date(b.service_at) - new Date(a.service_at));
    }

    // Eliminar duplicatas com base em NF e série, se existirem esses campos
    const uniqueByNfAndSerie = [];
    const seenKeys = new Set();

    for (const item of filteredData) {
        const key = `${item.id ?? ''}-${item.id ?? ''}`;
        if (!seenKeys.has(key)) {
            seenKeys.add(key);
            uniqueByNfAndSerie.push(item);
        }
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = uniqueByNfAndSerie.slice(startIndex, endIndex);

    pageData.forEach(item => {
        const row = document.createElement('tr');

        if (item.id) {
            const btnCell = document.createElement('td');
            btnCell.innerHTML = `
            <button onclick="openEditForm('delete_fileds', ${item.id})" class="button btn_default">
                <span class="material-symbols-outlined">delete</span>
            </button>`;

            row.appendChild(btnCell);
        }

        if (item.id) {
            const btnCell = document.createElement('td');
            btnCell.innerHTML = `
            <button onclick="openEditForm('update_fileds', ${item.id})" class="button btn_default">
                <span class="material-symbols-outlined">edit_square</span>
            </button>`;

            row.appendChild(btnCell);
        }

        Object.values(item).forEach(value => {
            const cell = document.createElement('td');

            if (typeof value === 'string') {

                // Verifica se é uma data no formato Y-m-d
                if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    const [year, month, day] = value.split('-');
                    value = `${day}/${month}/${year}`;
                    cell.textContent = value;
                }

                // Verifica se é uma cor hexadecimal
                else if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
                    const colorBox = document.createElement('div');
                    colorBox.style.width = '100%';
                    colorBox.style.height = '1.5rem';
                    colorBox.style.backgroundColor = value;
                    colorBox.style.border = '1px solid var(--black)';
                    colorBox.style.borderRadius = '4px';
                    colorBox.title = value; // Exibe o código da cor ao passar o mouse
                    cell.appendChild(colorBox);
                }
                else {
                    cell.textContent = value;
                }
            } else {
                cell.textContent = value;
            }
            row.appendChild(cell);
        });

        grid.appendChild(row);
    });

    renderPagination();
}


function renderPagination(action) {


    var function_exec = '';

    if (action == 'tasks') {
        function_exec = buildTasksList;
    } else {
        function_exec = renderGrid;
    }


    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    pagination.innerHTML = '';

    if (totalPages <= 1) return; // Se houver apenas uma página, não exibe paginação.

    const createPageButton = (pageNum, isDisabled = false) => {
        const btn = document.createElement('button');
        btn.classList.add('button', 'btn_page');
        btn.textContent = pageNum;
        btn.onclick = () => {
            currentPage = pageNum;
            function_exec();
        };
        if (isDisabled) btn.disabled = true;
        pagination.appendChild(btn);
    };

    // Botão "Anterior"
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '<span class="material-symbols-outlined">arrow_back</span>';
        prevButton.classList.add('button', 'btn_default');
        prevButton.onclick = () => {
            currentPage--;
            function_exec();
        };
        pagination.appendChild(prevButton);
    }

    // Sempre mostrar a primeira página
    createPageButton(1, currentPage === 1);

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 2) {
        startPage = 2;
        endPage = Math.min(3, totalPages - 1);
    } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(totalPages - 2, 2);
        endPage = totalPages - 1;
    }

    // Adiciona "..." se necessário
    if (startPage > 2) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        pagination.appendChild(dots);
    }

    // Renderiza os botões intermediários
    for (let i = startPage; i <= endPage; i++) {
        createPageButton(i, i === currentPage);
    }

    // Adiciona "..." se necessário
    if (endPage < totalPages - 1) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        pagination.appendChild(dots);
    }

    // Sempre mostrar a última página
    if (totalPages > 1) {
        createPageButton(totalPages, currentPage === totalPages);
    }

    // Botão "Próximo"
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<span class="material-symbols-outlined">arrow_forward</span>';
        nextButton.classList.add('button', 'btn_default');
        nextButton.onclick = () => {
            currentPage++;
            function_exec();
        };
        pagination.appendChild(nextButton);
    }
}


//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------


function applyFilter(idDialog, action) {

    const form = document.getElementById(idDialog);
    const inputs = form.querySelectorAll('input, select');

    const filtros = {};
    let start = null, end = null;
    let sortOrder = null;

    inputs.forEach(input => {
        const nome = input.name;
        const valor = input.value.trim();

        if (!valor) return;

        if (nome === "start_date") {
            start = new Date(valor);
        } else if (nome === "end_date") {
            end = new Date(valor);
        } else if (nome === "sort_id") {
            sortOrder = valor;
        } else {
            filtros[nome] = valor.toLowerCase(); // normaliza para comparação
        }
    });

    filteredData = resultadoConsulta.filter(item => {
        let matches = true;

        for (const chave in filtros) {
            const valorItem = item[chave]?.toString().toLowerCase();
            if (!valorItem || !valorItem.includes(filtros[chave])) {
                matches = false;
                break;
            }
        }

        if (start && end && item.service_at) {
            const itemDate = new Date(item.service_at);
            if (itemDate < start || itemDate > end) {
                matches = false;
            }
        }

        return matches;
    });

    // Ordenação por ID
    if (sortOrder === 'asc') {
        filteredData.sort((a, b) => a.id - b.id);
    } else if (sortOrder === 'desc') {
        filteredData.sort((a, b) => b.id - a.id);
    }

    currentPage = 1;
    form.close();

    if (action == 'tasks') {
        buildTasksList();
    } else {
        renderGrid();
    }
}

function clearFilter(idDialog, action) {

    filteredData = resultadoConsulta;
    currentPage = 1;

    closeModal(idDialog);

    if (action == 'tasks') {
        buildTasksList();
    } else {
        renderGrid();
    }
}

function closeModal(idDialog) {
    const form = document.getElementById(idDialog);
    const errorSpan = form.querySelector(".error span");

    if (errorSpan) {
        errorSpan.textContent = "";
    }

    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach(input => input.value = "");

    form.close();
}

function openEditForm(idDialog, id) {
    const form = document.getElementById(idDialog);
    const inputs = form.querySelectorAll("input[name], select[name], textarea[name]");

    const editData = filteredData.find(registro => registro.id == id);

    inputs.forEach(input => {
        input.value = editData[input.name] || "";
    });

    form.showModal();
}

function buildSelectProjetos(data_array) {
    const createOptions = (selectElements, getValue, getText) => {
        selectElements.forEach(select => {
            select.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Selecione um projeto';
            select.appendChild(defaultOption);

            data_array.forEach(item => {
                if (item.id && item.projeto_nome) {
                    const option = document.createElement('option');
                    option.value = getValue(item);
                    option.textContent = getText(item);
                    select.appendChild(option);
                }
            });
        });
    };

    const selectsById = document.querySelectorAll(".input_field select[name='id_projeto']");
    const selectsByName = document.querySelectorAll(".input_field select[name='projeto_nome']");

    createOptions(selectsById, item => item.id, item => item.projeto_nome);
    createOptions(selectsByName, item => item.projeto_nome, item => item.projeto_nome);
}

function buildSelectTarefas(data_array) {
    const createOptions = (selectElements, getValue, getText) => {
        selectElements.forEach(select => {
            select.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Selecione uma tarefa';
            select.appendChild(defaultOption);

            data_array.forEach(item => {
                if (item.id) {
                    const option = document.createElement('option');
                    option.value = getValue(item);
                    option.textContent = getText(item);
                    select.appendChild(option);
                }
            });
        });
    };

    const selectsById = document.querySelectorAll(".input_field select[name='id_tarefa']");

    createOptions(selectsById, item => item.id, item => item.tarefa_titulo);
}

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

async function buildTasksList() {
    const contField = document.getElementById('tasks_list');
    contField.innerHTML = '';

    if (filteredData.length == 0) {
        document.getElementById('tasks_list').classList.add('inactive');
        document.getElementById('error_get').classList.remove('inactive');
        return;
    } else {
        document.getElementById('tasks_list').classList.remove('inactive');
        document.getElementById('error_get').classList.add('inactive');
    }

    try {

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        pageData.forEach(item => {

            item.subtarefas = typeof item.subtarefas === "string"
                ? JSON.parse(item.subtarefas)
                : item.subtarefas;

            const box = document.createElement('div');
            box.classList.add('box');
            box.setAttribute('data-task', '');
            box.setAttribute('data-taskId', item.id);
            box.style.borderLeft = `0.5rem solid ${item.projeto_cor}`;

            // título da tarefa
            const taskTitle = document.createElement('div');
            taskTitle.classList.add('task-title');
            taskTitle.innerHTML = `
                <h2>#${item.id} - ${item.tarefa_titulo} - <span class="projeto_nome">${item.projeto_nome}</span></h2>
                <button class="button btn_default" onclick="putTasksCheck(${item.id})">
                    <span class="material-symbols-outlined">save</span>
                </button>
            `;

            const taskCronograma = document.createElement('span');
            taskCronograma.classList.add('task_cronograma');
            taskCronograma.textContent = item.cronograma;

            // descrição da tarefa
            const taskDesc = document.createElement('p');
            taskDesc.classList.add('task_desc');
            taskDesc.textContent = item.tarefa_descricao;

            // subtarefas
            const subtasksContainer = document.createElement('div');
            subtasksContainer.classList.add('subtasks');

            if (item.subtarefas && Array.isArray(item.subtarefas)) {

                // Ordena as subtarefas por ordem crescente
                const subtarefasOrdenadas = item.subtarefas.sort((a, b) => {
                    // Se ordem for null/undefined, considera como Infinity para ir ao final
                    const ordemA = a.ordem ?? Infinity;
                    const ordemB = b.ordem ?? Infinity;
                    return ordemA - ordemB;
                });

                subtarefasOrdenadas.forEach(sub => {
                    const label = document.createElement('label');

                    let isCheck = sub.status == 1 ? 'checked' : '';

                    label.innerHTML = `
                        <input type="checkbox" class="subtask" data-subid="${sub.id}" data-ordem="${sub.ordem}" ${isCheck}>
                        <span class="material-symbols-outlined dragbleIcon">drag_indicator</span>
                        <span class="custom-checkbox"></span>
                        ${sub.titulo}
                    `;
                    subtasksContainer.appendChild(label);
                });
            }

            // barra de progresso
            const progressContainer = document.createElement('div');
            progressContainer.classList.add('progress-container');

            const progressBar = document.createElement('div');
            progressBar.classList.add('progress-bar');
            progressContainer.appendChild(progressBar);

            const percentage = document.createElement('div');
            percentage.classList.add('percentage');
            percentage.textContent = '0%';

            // monta tudo no box
            box.appendChild(taskTitle);
            box.appendChild(taskCronograma);
            box.appendChild(taskDesc);
            box.appendChild(subtasksContainer);
            box.appendChild(progressContainer);
            box.appendChild(percentage);

            // adiciona na página
            contField.appendChild(box);
        });




        function updateProgress(taskElement) {
            const checkboxes = taskElement.querySelectorAll('.subtask');
            const progressBar = taskElement.querySelector('.progress-bar');
            const percentageText = taskElement.querySelector('.percentage');

            const total = checkboxes.length;
            const checked = [...checkboxes].filter(cb => cb.checked).length;

            let percentage = 0

            if (typeof checked === 'number' && typeof total === 'number' && total > 0) {
                percentage = Math.round((checked / total) * 100);
            } else {
                percentage = 0;
            }

            progressBar.style.width = percentage + '%';
            percentageText.textContent = percentage + '%';

            // Verifica se todas as subtarefas estão marcadas
            if (checked === total) {
                progressBar.classList.add('completed'); // adiciona uma classe, por exemplo
            } else {
                progressBar.classList.remove('completed'); // remove se não estiver completo
            }
        }

        document.querySelectorAll('[data-task]').forEach(task => {
            updateProgress(task);
            task.querySelectorAll('.subtask').forEach(checkbox => {
                checkbox.addEventListener('change', () => updateProgress(task));
            });
        });

    } catch (error) {
        console.error("Erro ao filtrar tarefas:", error);
    }

    applyDragFunction();
    renderPagination('tasks');
}

async function putTasksCheck(idTask) {
    const subtasks = document.querySelectorAll(`[data-taskid="${idTask}"] .subtask`);
    const data_base = [];

    subtasks.forEach(checkbox => {
        const checked = checkbox.checked ? 1 : 0;

        data_base.push({
            subtask_id: checkbox.dataset.subid,
            checked: checked
        });
    });

    try {

        const response = await fetch('/api-proxy.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'subtasks_check',
                campos: data_base,
                valores: data_base,
                id: idTask,
                subtasks: data_base
            })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "ok") {
            document.getElementById('success_modal').showModal();
        } else {
            throw new Error(`${data.resultado}`);
        }

    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
        document.getElementById('error_modal').showModal();
    }
}

function applyDragFunction() {

    document.querySelectorAll('.subtasks').forEach(subtaskContainer => {
        new Sortable(subtaskContainer, {
            animation: 150,
            ghostClass: 'dragging',
            onEnd: async function () {
                // Atualiza os atributos data-ordem após reordenar
                subtaskContainer.querySelectorAll('input.subtask').forEach((input, index) => {
                    input.dataset.ordem = index + 1;
                });

                // Se quiser salvar no servidor, pode capturar os dados aqui
                const taskId = subtaskContainer.closest('.box').dataset.taskid;
                const novaOrdemSubtasks = Array.from(subtaskContainer.querySelectorAll('input.subtask')).map((input, index) => {
                    return {
                        subid: input.dataset.subid,
                        ordem: index + 1
                    };
                });

                try {

                    const response = await fetch('/api-proxy.php', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            action: 'ordem_tarefas',
                            campos: novaOrdemSubtasks,
                            valores: novaOrdemSubtasks,
                            id: taskId,
                            tasksList: novaOrdemSubtasks
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`Erro HTTP: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.status === "ok") {
                        //console.log(`Ordem da tarefa ${taskId} salva com sucesso!`);
                    } else {
                        throw new Error(`${data.resultado}`);
                    }

                } catch (error) {
                    console.error(`Erro ao salvar ordem da tarefa ${taskId}:`, error);
                }
            }
        });
    });
}

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------


async function applyFilterCronograma(idDialog, idProjeto) {

    const form = document.getElementById(idDialog);

    if (idProjeto) {

        try {

            const response = await fetch(`/api-proxy.php?action=getCronegrama&id=${idProjeto}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === "ok") {

                resultadoConsulta = data.resultado;
                filteredData = [...resultadoConsulta];

            } else {
                throw new Error(`${data.resultado}`);
            }

        } catch (error) {
            console.error("Erro na busca:", error);
            return [];
        }

    } else {
        filteredData = [];
    }



    if (filteredData.length == 0) {
        document.getElementById('cronograma_field').classList.add('inactive');
        document.getElementById('error_get').classList.remove('inactive');
        form.close();

    } else {
        document.getElementById('cronograma_field').classList.remove('inactive');
        document.getElementById('error_get').classList.add('inactive');
        form.close();
        renderizarTarefas();
    }

}

function getDataLocalFormatada(valorInput) {
    const [ano, mes, dia] = valorInput.split('-').map(Number);
    return new Date(ano, mes - 1, dia); // mês começa em 0
}

function isDiaUtil(date) {
    const dia = date.getDay();
    return dia !== 0 && dia !== 6;
}

function adicionarDiasUteis(data, dias) {
    const novaData = new Date(data);
    let adicionados = 0;
    while (adicionados < dias) {
        novaData.setDate(novaData.getDate() + 1);
        if (isDiaUtil(novaData)) adicionados++;
    }
    return novaData;
}

function proximoDiaUtil(date) {
    const novaData = new Date(date);
    novaData.setDate(novaData.getDate() + 1);
    while (!isDiaUtil(novaData)) {
        novaData.setDate(novaData.getDate() + 1);
    }
    return novaData;
}

function formatarData(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function renderizarTarefas() {

    document.getElementById('projeto_nome').textContent = filteredData[0]['projeto_nome'];
    document.getElementById('projeto_descricao').textContent = filteredData[0]['projeto_descricao'];
    document.getElementById('startDate').value = filteredData[0]['dt_ini_projeto'];
    document.getElementById('dataFimProjetoValor').value = filteredData[0]['dt_fim_projeto'] ?? '';

    const ul = document.getElementById('taskList');
    ul.innerHTML = '';

    filteredData.forEach((tarefa) => {
        const li = document.createElement('li');
        li.dataset.id = tarefa.id;
        li.classList.add('box');
        li.innerHTML = `
            <span class="material-symbols-outlined dragbleIcon">drag_indicator</span>
            <div class="list_cont">
                <div class="task-header">
                    <div class="task-header-dth">
                        <span class="task_name_cr">${tarefa.title}</span>
                        <span class="task_desc_cr">${tarefa.tarefa_descricao}</span>
                    </div>
                    <div class="task_dayst">
                        <label>Dias úteis: </label>
                        <input class="diasUteis" type="number" min="1" value="${tarefa.diasUteis}" onchange="atualizarDiasUteis(${tarefa.id}, this.value)">
                    </div>
                </div>
                <div class="task_dates">
                    <div class="task_date">
                        <label>Início:</label>
                        <input class="inicio" type="date" value="${tarefa.dt_ini ?? ''}" disabled>
                    </div>
                    <div class="task_date">
                        <label>Fim:</label>
                        <input class="fim" type="date" value="${tarefa.dt_fim ?? ''}" disabled>
                    </div>
                </div>
            </div>
        `;
        ul.appendChild(li);
    });

    new Sortable(document.getElementById('taskList'), {
        animation: 150,
        onEnd: () => {
            recalcularDatas();
        }
    });

}

function atualizarDiasUteis(id, novoValor) {
    const tarefa = filteredData.find(t => t.id == id);
    if (tarefa) {
        tarefa.diasUteis = parseInt(novoValor);
        recalcularDatas();
    }
}

function recalcularDatas() {
    const dataInicial = getDataLocalFormatada(document.getElementById('startDate').value);
    let inicio = dataInicial;
    let ultimaDataFim = null;

    const taskElements = [...document.querySelectorAll('#taskList li')];
    const novaOrdem = [];

    taskElements.forEach(li => {
        const id = parseInt(li.dataset.id);
        const tarefa = filteredData.find(t => t.id == id);
        if (tarefa) novaOrdem.push(tarefa);
    });

    filteredData = novaOrdem;

    taskElements.forEach((li) => {
        const id = parseInt(li.dataset.id);
        const tarefa = filteredData.find(t => t.id == id);
        const fim = adicionarDiasUteis(inicio, tarefa.diasUteis - 1);
        li.querySelector('.inicio').value = formatarData(inicio);
        li.querySelector('.fim').value = formatarData(fim);

        inicio = proximoDiaUtil(fim);

        ultimaDataFim = fim;
    });

    if (ultimaDataFim) {
        document.getElementById('dataFimProjetoValor').value = formatarData(ultimaDataFim);
    }
}

async function saveCronograma() {
    document.getElementById('alert_modal').close();
    const errorModal = document.getElementById('error_modal');

    const projectId = document.getElementById('id_projeto').value;
    if (!projectId) {
        errorModal.querySelector('#mensagem_erro').textContent = 'Nenhum projeto selecionado!';
        errorModal.showModal();
        return;
    }

    const projectDtIni = document.getElementById('startDate').value;
    if (!projectDtIni) {
        errorModal.querySelector('#mensagem_erro').textContent = 'Data inicial do projeto não pode ser vazia!';
        errorModal.showModal();
        return;
    }

    const projectDtFim = document.getElementById('dataFimProjetoValor').value;
    if (!projectDtFim) {
        errorModal.querySelector('#mensagem_erro').textContent = 'Data final do projeto não pode ser vazia!';
        errorModal.showModal();
        return;
    }


    const tarefas = Array.from(document.querySelectorAll('#taskList > li')).map((li, index) => {
        return {
            id: li.dataset.id,
            ordem: index + 1,
            diasUteis: li.querySelector('input.diasUteis')?.value || '',
            inicio: li.querySelector('input.inicio')?.value || '',
            fim: li.querySelector('input.fim')?.value || ''
        };
    });

    try {

        const response = await fetch('/api-proxy.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'save_cronograma',
                campos: tarefas,
                valores: tarefas,
                id: projectId,
                tasks: tarefas,
                dtIniProj: projectDtIni,
                dtFimProj: projectDtFim
            })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "ok") {
            document.getElementById('success_modal').showModal();
        } else {
            throw new Error(`${data.resultado}`);
        }

    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
        errorModal.querySelector('#mensagem_erro').textContent = 'Contate o administrador do sistema.';
        errorModal.showModal();
    }


}


//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

const selectProjeto = document.getElementById('id_projeto');

if (selectProjeto) {
    selectProjeto.addEventListener('change', async (event) => {

        const projetoId = event.target.value;
        try {
            const resultadoConsulta = await getTarefasList();

            const dataFilter = resultadoConsulta.filter(item =>
                item.id_projeto == projetoId
            );

            buildSelectTarefas(dataFilter);

        } catch (error) {
            console.error("Erro ao filtrar tarefas:", error);
        }

    });
}
