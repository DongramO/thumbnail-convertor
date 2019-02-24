## 썸네일 생성기

```
기존에 API 서버에서 파일 업로드까지 함께 맡아 수행하고 있었으나,
API 서버의 성능 저하로 인해 File 업로드를 담당해 줄 File Server를 따로 분리하게 됨.

현재 코드에서는 총 2가지 Mobile과 PC용 두 가지의 썸네일을 제공한다
(그냥 코드를 조금만 수정해주면 필요한 크기의 썸네일을 생성할 수 있다)
```

> 회원정보 인증

기본적으로 API Server에서 수행하던 JWT인증 방식을 통해 회원에 대한 접근 가능성과 Session 정보를 체크한다

> 썸네일 생성 관련

ThumbNail 생성 관련하여, ImagickMagick & GraphicsMagick를 서버 로컬에 설치하여 ThumbNail을 생성한다.

> 파일 다운로드

기존의 방식 : S3를 통해 SignedUrl을 발급받아 이미지 파일을 사용하는 방식
변경된 방식 : 그리 보안적으로 중요하지 않은 데이터였기 때문에, 파일 Url에 클라이언트가 직접 접근하는 방식으로 수정


> 데이터베이스

데이터베이스 내부에는 게시물을 담당하는 Board Table과 Board를 참조하는 Files Table이 존재하며, 데이터베이스는 Master-Salve구조로 되어 있기 때문에, mysql package의 Cluster 기능을 이용하여 Connection을 가져온다. 

> 로직 수행 순서
- 회원 정보 조회 및 권한 체크
- 썸네일 생성 => S3 업로드 수행 
- 썸네일 삭제

