# 머신러닝 학습의 Hello World 와 같은 MNIST(손글씨 숫자 인식) 문제를 신경망으로 풀어봅니다.
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# MNIST 데이터를 다운로드하고 로드합니다.
# transforms.ToTensor()는 이미지를 텐서로 변환하고 0~1 범위로 정규화합니다.
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))  # MNIST 데이터셋의 평균과 표준편차
])

# 학습 데이터셋 로드
train_dataset = datasets.MNIST(
    root='./data',
    train=True,
    download=True,
    transform=transform
)

# 테스트 데이터셋 로드
test_dataset = datasets.MNIST(
    root='./data',
    train=False,
    download=True,
    transform=transform
)

# 데이터로더 생성
batch_size = 100
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

#########
# 신경망 모델 구성
######
# 입력 값의 차원은 [배치크기, 특성값] 으로 되어 있습니다.
# 손글씨 이미지는 28x28 픽셀로 이루어져 있고, 이를 784개의 특성값으로 정합니다.
# 결과는 0~9 의 10 가지 분류를 가집니다.
# 신경망의 레이어는 다음처럼 구성합니다.
# 784(입력 특성값)
#   -> 256 (히든레이어 뉴런 갯수) -> 256 (히든레이어 뉴런 갯수)
#   -> 10 (결과값 0~9 분류)

class MNISTNet(nn.Module):
    def __init__(self):
        super(MNISTNet, self).__init__()
        # 입력값에 가중치를 곱하고 ReLU 함수를 이용하여 레이어를 만듭니다.
        self.fc1 = nn.Linear(784, 256)
        # L1 레이어의 출력값에 가중치를 곱하고 ReLU 함수를 이용하여 레이어를 만듭니다.
        self.fc2 = nn.Linear(256, 256)
        # 최종 모델의 출력값은 fc3를 통해 10개의 분류를 가지게 됩니다.
        self.fc3 = nn.Linear(256, 10)
        
        # 가중치 초기화
        nn.init.normal_(self.fc1.weight, std=0.01)
        nn.init.normal_(self.fc2.weight, std=0.01)
        nn.init.normal_(self.fc3.weight, std=0.01)
    
    def forward(self, x):
        # 입력 이미지를 784차원 벡터로 변환
        x = x.view(-1, 784)
        # 첫 번째 레이어: ReLU 활성화 함수 적용
        x = F.relu(self.fc1(x))
        # 두 번째 레이어: ReLU 활성화 함수 적용
        x = F.relu(self.fc2(x))
        # 최종 출력 레이어 (softmax는 손실 함수에서 자동으로 처리됨)
        x = self.fc3(x)
        return x

#########
# 신경망 모델 학습
######
def train_model():
    # 모델 초기화
    model = MNISTNet()
    
    # 손실 함수: CrossEntropyLoss는 softmax와 cross entropy를 함께 처리합니다.
    criterion = nn.CrossEntropyLoss()
    
    # 옵티마이저: Adam 옵티마이저 사용 (학습률 0.001)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # 학습 모드 설정
    model.train()
    
    # 15 에포크 학습
    num_epochs = 15
    for epoch in range(num_epochs):
        total_cost = 0
        total_batch = len(train_loader)
        
        for batch_idx, (data, target) in enumerate(train_loader):
            # 옵티마이저의 기울기 초기화
            optimizer.zero_grad()
            
            # 순전파: 모델에 데이터를 입력하여 예측값 계산
            output = model(data)
            
            # 손실 계산
            loss = criterion(output, target)
            
            # 역전파: 기울기 계산
            loss.backward()
            
            # 가중치 업데이트
            optimizer.step()
            
            total_cost += loss.item()
        
        avg_cost = total_cost / total_batch
        print('Epoch:', '%04d' % (epoch + 1),
              'Avg. cost =', '{:.3f}'.format(avg_cost))
    
    print('최적화 완료!')
    return model

#########
# 결과 확인
######
def evaluate_model(model):
    # 평가 모드 설정
    model.eval()
    
    correct = 0
    total = 0
    
    # 기울기 계산 비활성화 (메모리 절약 및 속도 향상)
    with torch.no_grad():
        for data, target in test_loader:
            # 모델로 예측
            output = model(data)
            
            # 예측값에서 가장 큰 값을 가진 인덱스를 예측 레이블로 선택
            # 예) [0.1 0 0 0.7 0 0.2 0 0 0 0] -> 3
            _, predicted = torch.max(output.data, 1)
            
            total += target.size(0)
            correct += (predicted == target).sum().item()
    
    accuracy = 100 * correct / total
    print('정확도:', '{:.2f}%'.format(accuracy))
    return accuracy

if __name__ == '__main__':
    # 모델 학습
    model = train_model()
    
    # 모델 평가
    evaluate_model(model)

