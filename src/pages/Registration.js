/* eslint-disable */
import React from "react";
import { Formik, Form, Field, ErrorMessage, useField, FieldArray } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { propTypes } from "react-bootstrap/esm/Image";

const Registration = () => {
  let navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
    allergyList: [
      {value: "peanut", label:"peanut"},
      {value: "milk", label:"milk"}
    ],
  };

  const validationSchema = Yup.object().shape({
    // required()안에 문장 없어도 되고 커스텀은 문장 넣기
    username: Yup.string().min(3).max(20).required(),
    password: Yup.string().min(4).max(30).required(),
    // 회원가입 시, 알러지 체크 추가_12.06
    allergyList: Yup.array(Yup.string().min(1)),
  });
  // username, password 받음
  const onSubmit = (data) => {
    axios
      .post("https://allergy-check-app.herokuapp.com/auth", data)
      .then(() => {
        console.log(data);
        navigate("/");
      });
  };
  return (
    <div className="writePage">
      {/* 초기값 설정 */}
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <div className="formContent">
            <label>ID :</label>
            <Field
              autoComplete="off"
              id="inputCreatePost"
              name="username"
              placeholder=" 아이디를 입력하세요."
            />
          </div>
          <ErrorMessage name="username" component="span" />

          <div className="formContent">
            <label>Password :</label>
            <Field
              autoComplete="off"
              type="password"
              id="inputCreatePost"
              name="password"
              placeholder=" 비밀번호를 입력하세요."
            />
          </div>
          <ErrorMessage name="password" component="span" />

          <div className="formContent">
            <FieldArray
              name="allergyList"
              render={(arrayHelpers) => (
                <div>
                  {allergyList.map((allergy) => (
                    <label key={tag.value}>
                      <input
                        name="allergyList"
                        type="checkbox"
                        value={allergy}
                        checked={values.allergyList.includes(allergy.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            arrayHelpers.push(allergy.value);
                          } else {
                            const idx = values.allergyList.indexOf(allergy.value);
                            arrayHelpers.remove(idx);
                          }
                        }}
                      />
                      <span>{allergy.label}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          <button type="submit">등록하기</button>
        </Form>
      </Formik>
    </div>
  );
};

const CheckBox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });

  return <></>;
};
export default Registration;
