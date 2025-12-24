import cv2
import os

class LenaModel:
    def __init__(self):
        # 스크립트 파일의 디렉토리 기준으로 경로 설정
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self._cascade = os.path.join(script_dir, '../data/opencv/haarcascade_frontalface_alt.xml')
        self._img = os.path.join(script_dir, '../data/opencv/lena.jpg')

    def read_file(self):
        cascade = cv2.CascadeClassifier(self._cascade)
        
        # Original 버전 (IMREAD_COLOR)
        original = cv2.imread(self._img, cv2.IMREAD_COLOR)
        # Unchanged 버전
        unchanged = cv2.imread(self._img, cv2.IMREAD_UNCHANGED)
        
        # 이미지가 제대로 로드되었는지 확인
        if original is None:
            print(f'이미지를 로드할 수 없습니다: {self._img}')
            quit()
        
        print(f'이미지 크기: {original.shape}')
        
        # 얼굴 감지 (Original 이미지 사용)
        face = cascade.detectMultiScale(original, 
                                       scaleFactor=1.1, 
                                       minNeighbors=5, 
                                       minSize=(50, 50))
        
        print(f'감지된 얼굴 개수: {len(face)}')
        
        if len(face) == 0:
            print('얼굴을 찾을 수 없습니다.')
            # minSize를 더 줄여서 재시도
            face = cascade.detectMultiScale(original, 
                                           scaleFactor=1.1, 
                                           minNeighbors=3, 
                                           minSize=(30, 30))
            print(f'재시도 후 감지된 얼굴 개수: {len(face)}')
            if len(face) == 0:
                quit()
        
        # 얼굴 영역만 회색으로 변환한 버전 생성
        gray_face_img = original.copy()
        for idx, (x, y, w, h) in enumerate(face):
            print("얼굴인식 인덱스: ", idx)
            print("얼굴인식 좌표: ", x, y, w, h)
            # 얼굴 영역만 회색으로 변환
            gray_face_img = self.execute(gray_face_img, (x, y, x + w, y + h), 10)
        
        # 3개의 결과물 저장
        cv2.imwrite("lena-original.png", original)
        cv2.imwrite("lena-gray-face.png", gray_face_img)
        cv2.imwrite("lena-unchanged.png", unchanged)
        
        # 3개의 창에 표시
        cv2.imshow("Original", original)
        cv2.imshow("Gray Face", gray_face_img)
        cv2.imshow("Unchanged", unchanged)
        
        print("\n3개의 이미지가 표시되었습니다:")
        print("1. Original - 원본 이미지")
        print("2. Gray Face - 얼굴만 회색으로 처리")
        print("3. Unchanged - Unchanged 버전")
        print("\n아무 키나 누르면 창이 닫힙니다.")
        
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    @staticmethod
    def execute(img, rect, size=None):
        """
        얼굴 영역만 회색으로 변환하는 메서드
        img: 원본 이미지
        rect: (x1, y1, x2, y2) 얼굴 영역 좌표
        size: 사용하지 않음 (호환성을 위해 유지)
        """
        (x1, y1, x2, y2) = rect
        # 이미지 복사
        img2 = img.copy()
        # 얼굴 영역만 추출
        face_region = img2[y1:y2, x1:x2]
        # 얼굴 영역을 그레이스케일로 변환
        face_gray = cv2.cvtColor(face_region, cv2.COLOR_BGR2GRAY)
        # 그레이스케일을 BGR 형식으로 변환 (3채널로 만들기)
        face_gray_bgr = cv2.cvtColor(face_gray, cv2.COLOR_GRAY2BGR)
        # 원본 이미지의 얼굴 영역을 회색으로 교체
        img2[y1:y2, x1:x2] = face_gray_bgr
        return img2



if __name__ == '__main__':
    lena = LenaModel()
    lena.read_file()

