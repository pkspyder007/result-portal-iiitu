import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Skeleton} from 'antd';
import './Marksheet.css';

function Marksheet(props) {
  const [student, setStudent] = useState({});
  const [result, setResult] = useState({subjects: []});
  const [resultLoading, setResultLoading] = useState(true);

  // cdm
  useEffect(() => {
    const {roll, sem} = props.match.params;

    axios
      .get(`/api/student/${roll}`)
      .then(res => {
        setStudent(res.data);
        console.log(res.data);
      })
      .catch(err => console.log('unable to fetch student', err));

    // get result
    axios
      .get(`/api/result/${sem}/${roll}`)
      .then(res => {
        setResult(res.data);
        setResultLoading(false);
        console.log(res.data);
      })
      .catch(err => console.log('unable to fetch result', err));

    // fetching data
    // setTimeout(() => setStudent(std), 2000);
    // setTimeout(() => setResult(true), 4000);
  }, []);
  const {name, branch, roll} = student;
  return (
    <div>
      <Skeleton loading={!name}>
        <h3>Candidate's Name: {name || 'xxxxxxxxxxx'}</h3>
        <h3>Branch: {branch || 'xxxxxxxxxxx'}</h3>
        <h3>Roll No: {roll || 'xxxxxxxxxxx'}</h3>
      </Skeleton>
      <hr />
      <Skeleton loading={!result} paragraph={{rows: 0}}>
        {' '}
        <h4 style={{textAlign: 'center'}}>Semester {result.semester}</h4>
      </Skeleton>
      <hr />
      <Skeleton loading={resultLoading} paragraph={{rows: 5}}>
        <table>
          <tbody>
            <tr>
              <th>Sub Code</th>
              <th>Sub Names</th>
              <th>Grade</th>
            </tr>
            {result.subjects.map((sub, i) => {
              return (
                <tr key={i}>
                  <td>{sub.subCode}</td>
                  <td>{sub.subName}</td>
                  <td>{sub.subGrade}</td>
                </tr>
              );
            })}
            <tr>
              <td></td>
              <td></td>
              <td>
                <br />
                SGPA: {result.sgpa}
                <br />
                CGPA: {result.cgpa}
              </td>
            </tr>
          </tbody>
        </table>
      </Skeleton>
    </div>
  );
}

export default Marksheet;
