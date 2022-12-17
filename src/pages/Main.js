/* eslint-disable */
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { AuthContext } from '../helpers/AuthContext';

const Main = () => {
  // const [listOfPosts, setlistOfPosts] = useState([]);
  let navigate = useNavigate();

  const [listOfPosts, setListOfPosts] = useState([]);
  // 158
  const [likedPosts, setLikedPosts] = useState([]);
  //163
  // const { authState } = useContext(AuthContext);

  // data api
  const [apiData, setApiData] = useState([]);
  const [apiCheck, setApiCheck] = useState(false);
  const [inputItem, setInputItem] = useState("");

  // 알레르기 저장
  const [allegyData, setAllegyData] = useState([]);
  const allergyList = ['복숭아', '토마토', '홍합','밀가루','오징어','전복', '새우', '굴', '게', '고등어', '조개류', '땅콩', '메밀', '밀', '대두', '호두', '땅콩', '난류', '가금류', '우유', '쇠고기', '돼지고기', '닭고기'];

  useEffect(() => {
    // 163, 로그인 했는지 체크
    if(!localStorage.getItem("accessToken")){
      navigate('/login');
    } else {
      axios.get("http://localhost:3001/posts",
      // 157
      { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
        // console.log(response.data);
        // likedPosts가 추가되어 obj이기 때문에 listOfPosts 추가
        setListOfPosts(response.data.listOfPosts);
        // 158, 모든 id 목록 개별적으로 가짐
        setLikedPosts(response.data.likedPosts.map((like)=>{return like.PostId}));
      });
    }
    // 식품안전나라 test
    // axios.get(
    //   `http://openapi.foodsafetykorea.go.kr/api/sample/C002/json/1/10`).then((response)=>{
    //     console.log(response.data);
    //   })
  }, []);

  
  // const getFoodsItem = () => {
  //   searchItem = inputItem;
  //   axios.get(`http://localhost:3001/api/byId/${searchItem}`).then((response) => {
      
  //   let foodsArray = [...apiData, response.data.C002.row];
  //     setApiData(foodsArray);
  //     setApiCheck(true);
  //     console.log(response.data);
  //   });
  //   // .catch((error)=>{
  //   //   console.log(error);
  //   // });
    
  // }

  const getFoodsItem = async () => {
    if (inputItem) {
      await axios
        .get(
          `https://openapi.foodsafetykorea.go.kr/api/7bb345a5cae7405fb10f/C002/json/1/10/PRDLST_NM=${inputItem}`
        )
        .then((response) => {
          let apiData = [];
          let foodsArray = [];
          foodsArray = [...apiData, response.data.C002.row];
          setApiData(foodsArray[0]);
          setApiCheck(true);
          // console.log(foodsArray[0]);
          if (foodsArray && foodsArray.length > 0) {
            setAllegyData(foodsArray[0][0].RAWMTRL_NM);
          } else {
            console.log("nope");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert('검색어를 입력해주세요.');
    }
  };

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
      // 146
        setListOfPosts(listOfPosts.map((post)=>{
          if (post.id === postId) {
            // 게시물id와 포스트 id가 같으면 likes 필드 수정.
            if(response.data.liked){
              return {...post, Likes: [...post.Likes, 0]};
            } else {
              // 148, unlike post 배열 끝에서 pop
              const likesArray = post.Likes;
              likesArray.pop();
              return {...post, Likes: likesArray};
            }
          } else {
            return post
          }
        })
        );
        // 160
        if (likedPosts.includes(postId)){
          // 동일한 Id 필터링
          setLikedPosts(likedPosts.filter((id)=>{return id != postId;}))
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
      <div className="searchWrap">
        <div className="inner">
          <p className="main-title">Search</p>
            <section className="apiSearchWrap">
              <div className="apiLeftSide">
                <img className="apiSearchImg" src={process.env.PUBLIC_URL + "/banner/apiSearch.jpg"} />
                <div className="searchContainer">
                  <p>Search<br /> Now!</p>
                  <div className="apiSearchContent">
                    <label>제품명</label>
                    <input type="text" onChange={(e)=>{
                          setInputItem(e.target.value);
                      }} placeholder=" 제품명을 입력하세요."/>
                  </div>
                  <a className="apiSearchBtn" onClick={getFoodsItem}>Search</a>
                </div>
              </div>
              <div className="apiRightSide">
                {
                  apiCheck == true ? <ApiFoodsData apiData={apiData} allergyList={allergyList} allegyData={allegyData} /> : <ApiNullData />
                }
              </div>
            </section>
        </div>
      </div>
      <div className="postWrap">
        <div className="inner postContainer">
          <p className="main-title">게시글</p>
          <ul>
            {listOfPosts.map((value, key) => {
              return (
                <div key={key}>
                  <li>
                    <div className="title" onClick={() => {
                        navigate(`/post/${value.id}`);
                      }}>{value.title}
                    </div>
                    <div
                      className="content"
                      onClick={() => {
                        navigate(`/post/${value.id}`);
                      }}
                    >
                      {value.postContent}
                    </div>
                    <div className="username">{value.username}</div>
                    <div className="buttons">
                      {/* 152 */}
                      <ThumbUpIcon onClick={() => {
                        likeAPost(value.id);
                      }} 
                      // likedPosts array에 존재하는지
                        className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"} 
                      />
                      {/* 145  */}
                      <label>{value.Likes.length}</label>
                    </div>
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ApiFoodsData = (props) => {
  return (
    <>
      <ul className="apiFoodsTable">
        {
          props.apiData.map((value, key) => {
            let splitRawmtrlList = value.RAWMTRL_NM.split(',');
            let foodRawName = document.querySelector('.apiFoodsRawInfo');
            // for(var i=0; i<splitRawmtrlList.length; i++){
            //   if(splitRawmtrlList[i] == '우유'){
            //     console.log(splitRawmtrlList[i]);
            //     foodRawName.innerHTML="<h1>"+num.fontcolor("blue")+"은(는) 5의 배수가 <font color='blue'>맞습니다.</font></h1>";
            //   } else {
            //     console.log('nope');
            //   }
            // }
            return(
              <div key={key}>
                <li>
                  <p className="apiFoodsId">{key}</p>
                  <p className="apiFoodsName">품목명:<br/>{value.PRDLST_NM}</p>
                  <div className="apiFoodsRawInfo">
                    <p className="apiFoodsDcnm">유형: {value.PRDLST_DCNM}</p>
                    {
                      splitRawmtrlList.map((str, i)=>{
                        return(
                          <div key={i}>
                            {str == '땅콩' ? 
                              <p className="apiFoodsRawName" style={{color:'red',fontWeight:'bold',textDecoration:'underline',fontSize:'1.3em'}}>
                                {str}
                              </p> : 
                              <p className="apiFoodsRawName">
                                {str}
                              </p>
                            }
                            
                          </div>
                        )
                      })
                    }
                  </div>
                  </li>
                  {/* console.log(props.allergyList[key]); */}
                  {/* {console.log(value[key].RAWMTRL_NM)} */}
              </div>
            )
            
          })
        }
      </ul>
    </>
  )
};

const ApiNullData = () => {
  return(
    <>
      <p>null</p>
    </>
  );
}

export default Main;
