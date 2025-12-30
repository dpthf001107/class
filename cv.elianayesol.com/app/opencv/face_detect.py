import cv2
import os

class FaceDetect:
    def __init__(self):
        self._cascade = '../data/opencv/haarcascade_frontalface_alt.xml'
        self._img = '../data/opencv/girl.jpg'

    def read_file(self):
        cascade = cv2.CascadeClassifier(self._cascade)
        img = cv2.imread(self._img)
        face = cascade.detectMultiScale(img, minSize=(150, 150))
        if len(face) == 0:
            print('얼굴을 찾을 수 없습니다.')
            quit()
        for idx, (x, y, w, h) in enumerate(face):
            print("얼굴인식 인덱스: ", idx)
            print("얼굴인식 좌표: ", x, y, w, h)
            #밑에 다섯줄이 빨간 네모칸 만드는 것
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)
        script_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(script_dir, '../data/opencv/girl-face.png')
        cv2.imwrite(output_path, img)
        cv2.imshow("girl-face.png", img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

if __name__ == '__main__':
    face_detect = FaceDetect()
    face_detect.read_file()