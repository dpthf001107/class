"""
다나와 상품 가격 크롤러
Selenium을 사용한 동적 크롤링
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import json
import re
import time


def crawl_danawa_prices():
    """
    다나와 상품 목록에서 가격 정보를 크롤링합니다.
    
    Returns:
        list: 가격 정보 리스트
    """
    url = "https://prod.danawa.com/list/?cate=11254120"
    
    # Chrome 옵션 설정 (Docker 환경에서 headless 모드)
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    driver = None
    try:
        # Selenium WebDriver 초기화
        # Docker 환경에서는 /usr/local/bin/chromedriver 사용
        try:
            service = Service('/usr/local/bin/chromedriver')
            driver = webdriver.Chrome(service=service, options=chrome_options)
        except Exception as e:
            print(f"ChromeDriver 경로 지정 실패: {e}")
            # webdriver-manager 사용 시도
            try:
                from webdriver_manager.chrome import ChromeDriverManager
                service = Service(ChromeDriverManager().install())
                driver = webdriver.Chrome(service=service, options=chrome_options)
            except Exception as e2:
                print(f"webdriver-manager 사용 실패: {e2}")
                # 기본 경로 시도
                driver = webdriver.Chrome(options=chrome_options)
        
        print("페이지 로딩 중...")
        driver.get(url)
        
        # 페이지 로드 대기 (상품 리스트가 나타날 때까지)
        wait = WebDriverWait(driver, 15)
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "product_list")))
        
        # 추가 대기 (동적 콘텐츠 로드)
        print("동적 콘텐츠 로드 대기 중...")
        time.sleep(5)
        
        # 스크롤 다운 (더 많은 상품 로드)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        
        # 가격 정보 추출
        prices = []
        
        # 상품 리스트 찾기
        product_list = driver.find_element(By.CLASS_NAME, "product_list")
        product_items = product_list.find_elements(By.CSS_SELECTOR, "li.prod_item")
        
        print(f"찾은 상품 개수: {len(product_items)}")
        
        for idx, product in enumerate(product_items[:20]):  # 처음 20개만 처리
            try:
                # 상품명 추출
                try:
                    prod_name_elem = product.find_element(By.CSS_SELECTOR, "p.prod_name")
                    product_name = prod_name_elem.text.strip()
                except:
                    product_name = "N/A"
                
                # 가격 정보 영역 찾기 (prod_pricelist)
                price_list = []
                try:
                    prod_pricelist = product.find_element(By.CSS_SELECTOR, "div.prod_pricelist")
                    print(f"  상품 {idx+1}: prod_pricelist 찾음")
                    
                    # rel_item 또는 rel_special 클래스를 가진 가격 정보들 찾기
                    try:
                        price_elements = prod_pricelist.find_elements(By.CSS_SELECTOR, "dl.rel_item, dl.rel_special")
                        print(f"  상품 {idx+1}: 가격 요소 {len(price_elements)}개 찾음")
                    except Exception as e:
                        print(f"  상품 {idx+1}: 가격 요소 찾기 실패: {e}")
                        price_elements = []
                    
                    # 가격 요소를 찾지 못한 경우 다른 셀렉터 시도
                    if len(price_elements) == 0:
                        try:
                            # 다른 가능한 셀렉터들 시도
                            price_elements = prod_pricelist.find_elements(By.CSS_SELECTOR, "dl[class*='rel']")
                            print(f"  상품 {idx+1}: 대체 셀렉터로 {len(price_elements)}개 찾음")
                        except:
                            price_elements = []
                    
                    for price_elem in price_elements:
                        try:
                            # 가격 링크 찾기
                            price_link = price_elem.find_element(By.CSS_SELECTOR, "a")
                            
                            # title 속성에서 가격 정보 추출
                            price_title = price_link.get_attribute("title") or ""
                            price_text = price_link.text.strip()
                            
                            # 가격 정보가 있는 경우에만 처리
                            price_info_text = price_title if price_title else price_text
                            
                            if price_info_text:
                                # 가격 숫자 추출 (정규표현식 사용)
                                price_match = re.search(r'([\d,]+)\s*원', price_info_text)
                                price_value = price_match.group(1).replace(",", "") if price_match else None
                                
                                # 판매처 정보 추출
                                seller_match = re.search(r'\[([^\]]+)\]', price_info_text)
                                seller = seller_match.group(1) if seller_match else "N/A"
                                
                                # 혜택 정보 추출 (카드 혜택 등)
                                benefit_parts = []
                                if '신한카드' in price_info_text:
                                    benefit_parts.append('신한카드')
                                if '무이자' in price_info_text:
                                    benefit_match = re.search(r'무이자\s*최대\s*(\d+)\s*개월', price_info_text)
                                    if benefit_match:
                                        benefit_parts.append(f"무이자 최대 {benefit_match.group(1)}개월")
                                    else:
                                        benefit_parts.append('무이자')
                                
                                benefit = ' / '.join(benefit_parts) if benefit_parts else price_info_text
                                
                                # 링크 추출
                                price_href = price_link.get_attribute("href") or ""
                                
                                if price_value:
                                    price_info = {
                                        "price": int(price_value),
                                        "price_formatted": f"{int(price_value):,}원",
                                        "seller": seller,
                                        "benefit": benefit,
                                        "full_text": price_info_text,
                                        "link": price_href
                                    }
                                    price_list.append(price_info)
                                    print(f"    가격 정보 추가: {price_info['price_formatted']} ({price_info['seller']})")
                        except Exception as e:
                            print(f"    가격 요소 파싱 오류: {e}")
                            continue
                    
                    # 가격 요소를 찾지 못한 경우 직접 가격 텍스트 찾기 시도
                    if len(price_list) == 0:
                        try:
                            # prod_pricelist 내의 모든 링크에서 가격 정보 찾기
                            all_links = prod_pricelist.find_elements(By.CSS_SELECTOR, "a")
                            print(f"  상품 {idx+1}: 대체 방법으로 링크 {len(all_links)}개 찾음")
                            for link in all_links:
                                try:
                                    link_text = link.text.strip()
                                    link_title = link.get_attribute("title") or ""
                                    link_info = link_title if link_title else link_text
                                    
                                    if link_info and '원' in link_info:
                                        price_match = re.search(r'([\d,]+)\s*원', link_info)
                                        if price_match:
                                            price_value = price_match.group(1).replace(",", "")
                                            price_info = {
                                                "price": int(price_value),
                                                "price_formatted": f"{int(price_value):,}원",
                                                "seller": "N/A",
                                                "benefit": link_info,
                                                "full_text": link_info,
                                                "link": link.get_attribute("href") or ""
                                            }
                                            price_list.append(price_info)
                                            print(f"    대체 방법으로 가격 정보 추가: {price_info['price_formatted']}")
                                except:
                                    continue
                        except Exception as e:
                            print(f"  상품 {idx+1}: 대체 방법 실패: {e}")
                except Exception as e:
                    print(f"  상품 {idx+1}: 가격 정보 영역을 찾을 수 없습니다. {e}")
                    continue
                
                # 최저가 찾기
                if price_list:
                    min_price = min(price_list, key=lambda x: x["price"])
                    product_data = {
                        "product_name": product_name,
                        "min_price": min_price["price"],
                        "min_price_formatted": min_price["price_formatted"],
                        "min_price_seller": min_price["seller"],
                        "min_price_benefit": min_price["benefit"],
                        "all_prices": price_list,
                        "price_count": len(price_list)
                    }
                    prices.append(product_data)
                    print(f"  상품 {idx+1}: {product_name} - {min_price['price_formatted']} ({min_price['seller']})")
                    
            except Exception as e:
                print(f"상품 {idx+1} 파싱 중 오류 발생: {e}")
                continue
        
        return prices
        
    except Exception as e:
        print(f"크롤링 중 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        return []
    finally:
        if driver:
            driver.quit()


def main():
    """
    메인 함수: 크롤링 실행 및 JSON 출력
    """
    print("=" * 60)
    print("다나와 상품 가격 크롤링 시작 (Selenium)")
    print("=" * 60)
    
    # 크롤링 실행
    prices = crawl_danawa_prices()
    
    if prices:
        # JSON 형태로 출력 (한글 유니코드 이스케이프 방지)
        print(json.dumps(prices, ensure_ascii=False, indent=2))
        print(f"\n총 {len(prices)}개 상품의 가격 정보를 추출했습니다.")
    else:
        print("크롤링 결과가 없습니다.")
    
    print("=" * 60)


if __name__ == "__main__":
    main()
