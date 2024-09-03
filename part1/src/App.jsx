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
 * @Date: 2024-08-06 14:36:40
 * @LastEditors: 崩布猪
 * @LastEditTime: 2024-08-13 16:18:18
 * @FilePath: \web\part2 work\part1\src\App.jsx
 * @Description: 
 * 
 */
import { useState } from 'react'
const Course = ({ course }) => {
  return course.map(
    (course,index)=> {
      return (
        <div key={index}>
          <Header course={course} />
          <Content   course={course} />
        </div>
      )
    },
    
  )
  
  

}

const Header = ({ course }) => {
  return <h2 >{course.name}</h2>
}
const Content = ({ course }) => {
  return (
    <>
      <Part parts={course.parts} />
      <Sumtotal course={course} />
    </>

  )
}
const Part = ({ parts }) => {
  return parts.map(part => {
    return <p key={part.id}>{part.name}  {part.exercises}</p>
  }
  )
}

const Sumtotal = ({course}) => {
  const exercises = course.parts
  
  const total = exercises.reduce((acc, part) => acc + part.exercises, 0)

  return (  
    <h4>Total of {total} exercises</h4>  
  ); 
}
const App = () => {


  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]


  return (
    <Course course={courses} />
  )
}

export default App