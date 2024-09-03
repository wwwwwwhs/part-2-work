/*
 * _______________#########_______________________ 
 * ______________############_____________________ 
 * ______________#############____________________ 
 * _____________##__###########___________________ 
 * ____________###__######_#####__________________ 
 * ____________###_#######___####_________________ 
 * ___________###__##########_####________________ 
 * __________####__###########_####_______________ 
 * ________#####___###########__#####_____________ 
 * _______######___###_########___#####___________ 
 * _______#####___###___########___######_________ 
 * ______######___###__###########___######_______ 
 * _____######___####_##############__######______ 
 * ____#######__#####################_#######_____ 
 * ____#######__##############################____ 
 * ___#######__######_#################_#######___ 
 * ___#######__######_######_#########___######___ 
 * ___#######____##__######___######_____######___ 
 * ___#######________######____#####_____#####____ 
 * ____######________#####_____#####_____####_____ 
 * _____#####________####______#####_____###______ 
 * ______#####______;###________###______#________ 
 * ________##_______####________####______________ 
 * 
 * @Author: 崩布猪
 * @Date: 2024-08-13 18:54:17
 * @LastEditors: 崩布猪
 * @LastEditTime: 2024-09-03 16:49:07
 * @FilePath: \web\part2 work\part2\src\App.jsx
 * @Description: 
 * 
 */

import { useState, useEffect } from 'react'
import phoneSever from './services/phone'
import './App.css'

const PersonForm = ({ persons, newName, newNum, setNewName, setNewNum, setPersons,setErrorMessage }) => {
  // 处理添加新联系人的表单组件

  const addPerson = event => {
    event.preventDefault();

    const existingPerson = persons.find(obj => obj.name === newName);
    if (existingPerson) {
      // 如果联系人已经存在，则更新联系人信息
      if (window.confirm(`update ${existingPerson.name}?`)) {
        const changedphone = { ...existingPerson, number: newNum };
        const id = existingPerson.id;
        phoneSever
          .updatePsn(id, changedphone)
          .then(returnedphone => {
            setPersons(prevPersons =>
              prevPersons.map(person =>
                person.name !== newName ? person : returnedphone
              )
            );
          })
          .catch(error => {
          
            setErrorMessage(
              `added ${newName} error`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          }) 
      }
    } else {
      // 如果联系人不存在，则添加联系人
      const newPerson = {
        name: newName,
        number: newNum,
        id: (persons.length + 1).toString()
      }
      phoneSever
        .create(newPerson)
        .then(response => {
          console.log(response);
          setPersons(prevPersons => [...prevPersons, newPerson]);
          setNewName('');
          setNewNum('');
        })
        .catch(error => {
          setErrorMessage(
            `added ${newName} error `
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }) 
        
    }
    setErrorMessage(
      `added ${newName} number`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }




  const handleNameChange = event => setNewName(event.target.value)
  const handleNumChange = event => setNewNum(event.target.value)

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input
          value={newName}
          onChange={handleNameChange} />
      </div>
      <div>number: <input
        value={newNum}
        onChange={handleNumChange}
      /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

// 显示联系人列表的组件
const Persons = ({ people, setPersons,setErrorMessage }) => {

  const deletePerson = (id) => {
    // 删除联系人函数
    if (window.confirm(`delete ${people.name}?`)) {
      phoneSever
        .deletePsn(id).then(response => {
          console.log(response);
          setPersons(prevPersons => prevPersons.filter(person => person.id !== id))
        }).catch(error => {
          console.error("Failed to delete person:", error);
          // 可以在这里添加更多的错误处理逻辑，例如显示错误消息给用户
          setErrorMessage(
            `Failed to delete person:`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }

  }

  return (
    <>
      {people.map(person => (
        <div key={person.id}>
          <p>
            {person.name}: {person.number}
            <button onClick={() => deletePerson(person.id)}>Delete</button>
          </p>
        </div>
      ))}
    </>
  )
}


const Filter = ({ searchName, setSearchName }) => {
  // 过滤联系人的组件
  const handleSearchNameChange = event => setSearchName(event.target.value)
  return (
    <>
      <form >
        <div>
          filter show with: <input
            value={searchName}
            onChange={handleSearchNameChange}
          />
        </div>
      </form>
    </>
  )
}
// 错误信息组件
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}
const App = () => {
  // 主应用组件，管理联系人列表、新联系人信息、搜索名称的状态，并从服务器获取联系人数据
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [searchName, setSearchName] = useState('')
  const [errorMessage, setErrorMessage] = useState('tips...')


  useEffect(() => {
    console.log('effect');
    phoneSever.getAll().then(response => {
      console.log(response);
      console.log('promise fulfilled');
      setPersons(response)
    })

  }, [])

  const PhoneobookToShow = persons.filter(person => {
    const regex = new RegExp(searchName, 'i');
    return regex.test(person.name);
  })

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter searchName={searchName} setSearchName={setSearchName} setErrorMessage={setErrorMessage} />
      <h2>ADD a New</h2>
      <PersonForm persons={persons} newName={newName} newNum={newNum} setNewName={setNewName} setPersons={setPersons} setNewNum={setNewNum} setErrorMessage={setErrorMessage} />
      <h2>Numbers</h2>
      <Persons people={PhoneobookToShow} setPersons={setPersons} />
    </div>
  )
}

export default App