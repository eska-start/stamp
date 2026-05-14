# 칭찬 스탬프북 배포 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com) 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름 입력 (ex: `praise-stamp-book`)
4. Google Analytics는 선택 사항

## 2. Firestore 데이터베이스 활성화

1. 좌측 메뉴 **Firestore Database** 클릭
2. **데이터베이스 만들기** 클릭
3. **테스트 모드**로 시작 (나중에 규칙 변경)
4. 위치는 `asia-northeast3` (서울) 선택

## 3. Firestore 보안 규칙 설정

Firestore Console → **규칙** 탭 → 아래 규칙으로 교체:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ 이 규칙은 개발용입니다. 실제 운영 시 Firebase Anonymous Auth를
> 적용하여 전소유자만 수정 가능하도록 강화하는 것을 권장합니다.

## 4. Firebase 웹 앱 설정값 확인

1. Firebase Console → 프로젝트 설정 (�니바퀴 아이콘)
2. **앱 추가** → 웹(`</>`)
3. 앱 닉네임 입력 → 등록
4. 표시되는 `firebaseConfig` 값을 복사

## 5. 로친 개발 환경 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123...:web:abc...
```

```bash
npm install
npm run dev
```

## 6. Vercel 배포

### GitHub 연동

1. [Vercel](https://vercel.com) 로그인
2. **Add New Project** 클릭
3. GitHub 레포 (`eska-start/stamp`) 선택
4. **Framework Preset**: Vite 자동 감지
5. **Branch**: `claude/praise-stamp-app-5fvlr` 선택

### 환경 변수 입력

Vercel 프로젝트 → Settings → Environment Variables에 아래 6개 입력:

| Key | Value |
|-----|-------|
| `VITE_FIREBASE_API_KEY` | 파이어베이스 설정에서 복사 |
| `VITE_FIREBASE_AUTH_DOMAIN` | 파이어베이스 설정에서 복사 |
| `VITE_FIREBASE_PROJECT_ID` | 파이어베이스 설정에서 복사 |
| `VITE_FIREBASE_STORAGE_BUCKET` | 파이어베이스 설정에서 복사 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 파이어베이스 설정에서 복사 |
| `VITE_FIREBASE_APP_ID` | 파이어베이스 설정에서 복사 |

6. **Deploy** 클릭!

---

## 데이터 구조 (Firestore)

```
users/
  {userId}/
    id: string
    username: string
    parentPin: string         # 4자리 숫자
    children: Child[]
    missionTemplates: Mission[]
    rewards: Reward[]
    rewardExchanges: Exchange[]
    dailyMissions: { [date]: Mission[] }
```
