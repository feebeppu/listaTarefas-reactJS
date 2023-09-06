import { useState, useEffect } from 'react'
import './admin.css'

import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'
import { 
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
    doc,
    deleteDoc,
    updateDoc
} from 'firebase/firestore'

export default function Admin() {

    const [tarefaInput, setTarefaInput] = useState('')
    const [user, setUser] = useState({})
    const [edit, setEdit] = useState({})

    const [tarefas, setTarefas] = useState([])

    useEffect(() => {
        async function loadTarefas() {
            const userDetail = localStorage.getItem("@detailUser")
            setUser(JSON.parse(userDetail))

            // se ele encontrou os dados no localStorage
            if(userDetail) {
                const data = JSON.parse(userDetail)
                const tarefaRef = collection(db, "tarefas")
                // usamos a query para fazer uma busca dentro da tarefaRef
                const q = query(tarefaRef, orderBy("created", "desc"), where("userUid", "==", data?.uid))

                const unsub = onSnapshot(q, (snapshot) => {
                    let lista = []

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })

                    setTarefas(lista)

                })
            }
        }

        loadTarefas()
    },[])

    async function handleRegister(e) {
        e.preventDefault()

        if(tarefaInput === ''){
            alert("Digite sua tarefa")
            return
        }

        // aqui verificamos se tem algo dentro do edit, ou seja, se alguém clicou pra editar a tarefas
        if(edit?.id) {
            handleUptadeTarefa()
            return
        }

        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefaInput,
            created: new Date(),
            // usamos o ? pois caso o uid venha vazio, ele não trava a aplicação, ele devolve como vazio
            userUid: user?.uid
        })
        .then(() => {
            console.log("Tarefa Registrada")
            setTarefaInput("")
        })
        .catch((error) => {
            console.log("Erro ao registrar: " + error)
        })
    }   

    async function handleLogout() {
        await signOut(auth)
    }

    async function deleteTarefa(id){
        const docRef = doc(db, "tarefas", id)
        await deleteDoc(docRef)
    }   

    async function editTarefa(item) {
        setTarefaInput(item.tarefa)
        setEdit(item)
    }

    async function handleUptadeTarefa() {
        const docRef = doc(db, "tarefas", edit?.id)
        await updateDoc(docRef, {
            tarefa: tarefaInput
        })
        .then(() => {
            console.log("Tarefa Atualizada")
            setTarefaInput("")
            setEdit({})
        })
        .catch(() => {
            console.log("Erro ao atualizar!")
            setTarefaInput("")
            setEdit({})
        })
    }


    return(
        <div className="admin-container">
            <h1>Minhas Tarefas</h1>

            <form onSubmit={handleRegister} className="form">
                <textarea
                    placeholder="Digite sua tarefa..."
                    value={tarefaInput}
                    onChange={(e) => setTarefaInput(e.target.value)}
                />

                {/* Object.keys é um "rec" para saber se tem algo dentro do nosso objeto, se ele tiver algo, quer dizer que clicamos no botão  */}
                {Object.keys(edit).length > 0 ? (
                    <button type="submit" style={{backgroundColor: '#6add39'}} className="btn-register">Atualizar tarefa</button>
                ) : (
                    <button type="submit" className="btn-register">Registrar tarefa</button>
                )} 
            </form>

            {tarefas.map((item) => (
                <article key={item.id} className="list">
                    <p>{item.tarefa}</p>

                    <div>
                        <button onClick={() => editTarefa(item)}>Editar</button>
                        <button className="btn-delete" onClick={() => deleteTarefa(item.id)}>Concluir</button>
                    </div>
                </article>
            ))}

            <button className="btn-logout" onClick={handleLogout}>Sair da conta</button>
        </div>
    )
}