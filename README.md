# google-scholar-keyword-crwaler
```
구글 reCAPTCHA 문제로 중단했어요...
Beautifulsoup & Selenium으로 해도 해결이 잘안되어 다른 방안을 탐색 중입니다.
```
## 1. 간단한 설명
대학원생들이라면 논문을 많이 보겠죠. 구글 스칼라에서 논문 찾아보다가 최근 연구 동향같은게 궁금한데 일일이 찾기 힘들자나요. 그래서 크롤링으로 논문 제목에 있는 단어를 카운팅하여, 최근 연구 동향 파악하는데 도움을 주고자 만들어 봤습니다. (계속 다듬어 나가보겠습니다.)
## 2. 설치 및 사용법
### 2.1. 설치
```
1. git clone https://github.com/pentas1150/google-scholar-keyword-crwaler.git
2. npm i
```
### 2.2. 사용법
```
1. .env에서 SEARCH와 START_YEAR, END_PAGE 수정
=>SEARCH : 검색어, START_YEAR : 시작 연도 설정, 0이면 기간 없음, END_PAGE : 1페이지부터 몇 페이지까지 크롤할지 범위 
2. node crwal로 실행
```
