import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
import matplotlib.pyplot as plt
import numpy as np

class MnistTest:
    def __init__(self):
        self.class_names = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
                           'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot']
    
    def create_model(self):
        # Fashion-MNIST 데이터셋 로드
        transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize((0.5,), (0.5,))  # 0~1 범위를 -1~1로 정규화
        ])
        
        fashion_mnist_train = datasets.FashionMNIST(
            root='./data',
            train=True,
            download=True,
            transform=transform
        )
        
        fashion_mnist_test = datasets.FashionMNIST(
            root='./data',
            train=False,
            download=True,
            transform=transform
        )
        
        train_loader = DataLoader(fashion_mnist_train, batch_size=32, shuffle=True)
        test_loader = DataLoader(fashion_mnist_test, batch_size=32, shuffle=False)
        
        # 원본 이미지 데이터 가져오기 (시각화용, 정규화 전)
        train_images_raw = fashion_mnist_train.data.numpy() / 255.0
        train_labels_raw = fashion_mnist_train.targets.numpy()
        test_images_raw = fashion_mnist_test.data.numpy() / 255.0
        test_labels_raw = fashion_mnist_test.targets.numpy()
        
        # print('행: %d, 열: %d' % (train_images_raw.shape[0], train_images_raw.shape[1]))
        # print('행: %d, 열: %d' % (test_images_raw.shape[0], test_images_raw.shape[1]))
        
        # plt.figure()
        # plt.imshow(train_images_raw[3], cmap='gray')
        # plt.colorbar()
        # plt.grid(False)
        # plt.show()
        
        # 시각화: 처음 25개 이미지
        plt.figure(figsize=(10, 10))
        for i in range(25):
            plt.subplot(5, 5, i + 1)
            plt.xticks([])
            plt.yticks([])
            plt.grid(False)
            plt.imshow(train_images_raw[i], cmap=plt.cm.binary)
            plt.xlabel(self.class_names[train_labels_raw[i]])
        # plt.show()
        
        # 모델 정의
        """
        relu (Rectified Linear Unit 정류한 선형 유닛)
        미분 가능한 0과 1사이의 값을 갖도록 하는 알고리즘
        softmax
        nn (neural network)의 최상위층에서 사용되며 classification을 위한 function
        결과를 확률값으로 해석하기 위한 알고리즘
        """
        class FashionNet(nn.Module):
            def __init__(self):
                super(FashionNet, self).__init__()
                self.flatten = nn.Flatten()
                self.fc1 = nn.Linear(28 * 28, 128)
                self.fc2 = nn.Linear(128, 10)
            
            def forward(self, x):
                x = self.flatten(x)
                x = F.relu(self.fc1(x))
                x = self.fc2(x)  # softmax는 손실 함수에서 처리되거나 마지막에 적용
                return x
        
        model = FashionNet()
        
        # 손실 함수와 옵티마이저
        criterion = nn.CrossEntropyLoss()  # sparse_categorical_crossentropy와 동일
        optimizer = optim.Adam(model.parameters())
        
        # 학습
        model.train()
        num_epochs = 5
        for epoch in range(num_epochs):
            running_loss = 0.0
            correct = 0
            total = 0
            
            for images, labels in train_loader:
                optimizer.zero_grad()
                outputs = model(images)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()
                
                running_loss += loss.item()
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
            
            epoch_loss = running_loss / len(train_loader)
            epoch_acc = 100 * correct / total
            print(f'Epoch {epoch + 1}/{num_epochs}, Loss: {epoch_loss:.4f}, Accuracy: {epoch_acc:.2f}%')
        
        # 테스트
        model.eval()
        test_loss = 0.0
        correct = 0
        total = 0
        all_predictions = []
        
        with torch.no_grad():
            for images, labels in test_loader:
                outputs = model(images)
                loss = criterion(outputs, labels)
                test_loss += loss.item()
                
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
                
                # 예측 확률 저장 (softmax 적용)
                probs = F.softmax(outputs, dim=1)
                all_predictions.append(probs.cpu().numpy())
        
        test_acc = 100 * correct / total
        print(f'\n테스트 정확도: {test_acc:.2f}%')
        
        # 모든 예측 결과 합치기
        predictions = np.concatenate(all_predictions, axis=0)
        
        # prediction
        print(f'\n테스트 이미지 3번 예측 확률:')
        print(predictions[3])
        
        # 10개 클래스에 대한 예측을 그래프화
        arr = [predictions, test_labels_raw, test_images_raw]
        return arr, model
    
    def plot_image(self, i, predictions_array, true_label, img):
        print(' === plot_image 로 진입 ===')
        predictions_array, true_label, img = predictions_array[i], true_label[i], img[i]
        plt.grid(False)
        plt.xticks([])
        plt.yticks([])
        
        plt.imshow(img, cmap=plt.cm.binary)
        # plt.show()
        predicted_label = np.argmax(predictions_array)
        if predicted_label == true_label:
            color = 'blue'
        else:
            color = 'red'
        
        plt.xlabel("{} {:2.0f}% ({})".format(self.class_names[predicted_label],
                                              100 * np.max(predictions_array),
                                              self.class_names[true_label]),
                   color=color)
    
    @staticmethod
    def plot_value_array(i, predictions_array, true_label):
        predictions_array, true_label = predictions_array[i], true_label[i]
        plt.grid(False)
        plt.xticks([])
        plt.yticks([])
        thisplot = plt.bar(range(10), predictions_array, color="#777777")
        plt.ylim([0, 1])
        predicted_label = np.argmax(predictions_array)
        
        thisplot[predicted_label].set_color('red')
        thisplot[true_label].set_color('blue')


if __name__ == '__main__':
    mnist_test = MnistTest()
    arr, model = mnist_test.create_model()
    predictions, test_labels, test_images = arr
    
    # 예시: 첫 번째 이미지 시각화
    if len(predictions) > 0:
        i = 0
        plt.figure(figsize=(6, 3))
        plt.subplot(1, 2, 1)
        mnist_test.plot_image(i, predictions, test_labels, test_images)
        plt.subplot(1, 2, 2)
        mnist_test.plot_value_array(i, predictions, test_labels)
        plt.tight_layout()
        # plt.show()

