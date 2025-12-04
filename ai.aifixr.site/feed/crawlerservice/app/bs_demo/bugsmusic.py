"""
Bugs Music 실시간 차트 크롤러
BeautifulSoup4를 사용한 정적 크롤링
"""
import requests
from bs4 import BeautifulSoup
import json


def crawl_bugs_chart():
    """
    Bugs Music 실시간 차트에서 곡 정보를 크롤링합니다.
    
    Returns:
        list: 곡 정보 리스트 (title, artist, album)
    """
    url = "https://music.bugs.co.kr/chart/track/realtime/total?wl_ref=M_contents_03_01"
    
    # User-Agent 헤더 설정 (크롤링 차단 방지)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        # HTTP GET 요청
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # HTTP 에러 체크
        
        # HTML 파싱
        soup = BeautifulSoup(response.text, 'lxml')
        
        # 차트 데이터 추출
        songs = []
        
        # tbody 내의 tr 요소들을 찾음
        tbody = soup.find('tbody')
        if not tbody:
            print("Error: tbody 요소를 찾을 수 없습니다.")
            return []
        
        rows = tbody.find_all('tr')
        
        for row in rows:
            try:
                # title 클래스에서 곡 제목 추출
                title_elem = row.find('p', class_='title')
                title = title_elem.get_text(strip=True) if title_elem else "N/A"
                
                # artist 클래스에서 아티스트 추출
                artist_elem = row.find('p', class_='artist')
                artist = artist_elem.get_text(strip=True) if artist_elem else "N/A"
                
                # album 클래스에서 앨범명 추출
                album_elem = row.find('a', class_='album')
                album = album_elem.get_text(strip=True) if album_elem else "N/A"
                
                # 데이터 저장
                song_data = {
                    "title": title,
                    "artist": artist,
                    "album": album
                }
                songs.append(song_data)
                
            except Exception as e:
                print(f"행 파싱 중 오류 발생: {e}")
                continue
        
        return songs
        
    except requests.exceptions.RequestException as e:
        print(f"HTTP 요청 오류: {e}")
        return []
    except Exception as e:
        print(f"크롤링 중 오류 발생: {e}")
        return []


def main():
    """
    메인 함수: 크롤링 실행 및 JSON 출력
    """
    print("=" * 60)
    print("Bugs Music 실시간 차트 크롤링 시작")
    print("=" * 60)
    
    # 크롤링 실행
    songs = crawl_bugs_chart()
    
    if songs:
        # JSON 형태로 출력 (한글 유니코드 이스케이프 방지)
        print(json.dumps(songs, ensure_ascii=False, indent=2))
        print(f"\n총 {len(songs)}곡의 정보를 추출했습니다.")
    else:
        print("크롤링 결과가 없습니다.")
    
    print("=" * 60)


if __name__ == "__main__":
    main()

