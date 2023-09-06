import { useState, useEffect } from 'react'
import { auth } from '../firebaseConnection'
import { onAuthStateChanged } from 'firebase/auth'

import { Navigate } from 'react-router-dom'

// children seria qual a rota que vai ser Privada
export default function Private({ children }){
    
    // passamos true porque ele começa carregando, até saber se tem um usuário logado ou não
    const [loading, setLoading] = useState(true)
    // passamos false pois ele não começa logado, até verificarmos dentro do useEffect se tem algum usuário logado ou não
    const [signed, setSigned] = useState(false)


    useEffect(() => {
        async function checkLogin() {
            // onAuthStateChanged vai ficar "olhando" se existe alguem logado
            const unsub = onAuthStateChanged(auth, (user) =>{
                // se tem user logado
                if(user){
                    const userData = {
                        uid: user.uid,
                        email: user.email
                    }

                    localStorage.setItem("@detailUser", JSON.stringify(userData))

                    // setLoading passa a ser false, pois agora o usuário estará logado e passado para o localStorage
                    setLoading(false)
                    // setSigned true, acabou o loading e agora o usuário está logado de fato
                    setSigned(true)
                } else{
                    // não possui user logado
                    setLoading(false)
                    setSigned(false)
                }
            })
        }

        checkLogin()
    }, [])

    // se está carregando, não mostramos nada por enquanto, até tiver o return
    if(loading) {
        return(
            <div></div>
        )
    }

    // se está tentando acessar o admin e não está logado, será redirecionado para a página Home
    if(!signed) {
        return <Navigate to="/"/>
    }

    return children
}