// index.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { secondaryColor } from "../../styles/colors";
import Content from "./ContentComponent";
import SideContent from "./SideContentComponent";

function Purpose() {
  const navigate = useNavigate();
  const [contentData, setContentData] = useState({
    mainGoal: ["", "", ""],
    achievedList: ["", "", ""],
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/session") // 세션 확인 API
      .then((response) => {
        if (response.data.user_id) {
          // 로그인된 상태: 데이터 로드
          axios
            .get(`http://localhost:3000/api/purposefetch?user_id=${response.data.user_id}`)
            .then((res) => {
              setContentData({
                mainGoal: res.data.mainGoals || ["", "", ""],
                achievedList: res.data.achievedLists || ["", "", ""],
              });
            })
            .catch((err) => console.error("데이터 로드 오류:", err));
        } else {
          // 로그인되지 않은 상태: 빈 값 유지
          setContentData({
            mainGoal: ["", "", ""],
            achievedList: ["", "", ""],
          });
        }
      })
      .catch((error) => {
        console.error("세션 확인 오류:", error);
        setContentData({
          mainGoal: ["", "", ""],
          achievedList: ["", "", ""],
        });
      });
  }, []);

  const handleEdit = () => {
    navigate("/purpose/input"); // Navigate to input page
  };

  const handleDelete = (index) => {
    const selectedNumber = index + 1; // index는 0부터 시작하므로 +1
    axios
      .post("http://localhost:3000/api/purposedelete", {
        user_id: "frost", // 로그인된 사용자의 ID를 사용해야 함
        selectedNumber,
      })
      .then((response) => {
        alert(response.data.message);

        // 상태 업데이트: 삭제된 데이터를 빈 문자열로 변경
        setContentData((prev) => {
          const updatedMainGoal = [...prev.mainGoal];
          const updatedAchievedList = [...prev.achievedList];

          updatedMainGoal[index] = ""; // 삭제된 타이틀 비우기
          updatedAchievedList[index] = ""; // 삭제된 컨텐츠 비우기

          return {
            mainGoal: updatedMainGoal,
            achievedList: updatedAchievedList,
          };
        });
      })
      .catch((error) => {
        console.error("삭제 중 오류 발생:", error);
        alert("삭제 중 문제가 발생했습니다.");
      });
  };

  return (
    <Intro>
      <Wrap>
        <MainContent>
          {/* Main Goal Section */}
          <Content
            header="메인 목적"
            items={[1, 2, 3]} // Fixed 1, 2, 3 icons
            data={contentData.mainGoal} // Pass the main goals (max 3)
            onEdit={handleEdit}
            onDelete={handleDelete} // Pass the delete function
          />

          {/* Achievement List Section */}
          <Content
            header="달성 리스트"
            items={[1, 2, 3]} // Fixed 1, 2, 3 icons
            data={contentData.achievedList.map((item) => (
              <PreStyled>{item}</PreStyled> // 줄바꿈 유지
            ))} // Pass the achievement list (max 3)
            onEdit={handleEdit}
            onDelete={handleDelete} // Pass the delete function
          />
        </MainContent>
        <LeftSide>
          <SideContent />
        </LeftSide>
      </Wrap>
    </Intro>
  );
}

export default Purpose;

// Styled components
const LeftSide = styled.div`
  flex: 1;
  margin: 0 20px 20px 20px;
`;

const Intro = styled.div`
  width: 100%;
  min-height: 650px; /* 최소 높이를 설정 */
  background-color: ${secondaryColor};
  display: flex;
  flex-direction: column; /* 내용이 아래로 쌓이도록 설정 */
`;

const Wrap = styled.div`
  display: flex;
  width: 1280px;
  margin: 0 auto;
  flex-grow: 1; /* flex-grow로 내부 콘텐츠가 여유 공간을 채우도록 설정 */
`

const MainContent = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PreStyled = styled.div`
  white-space: pre-wrap; /* 줄바꿈을 반영 */
  word-wrap: break-word; /* 긴 단어 줄바꿈 */

`;
