# Roman Numerals Encoder - 4Kyu
HASH ={"I"=> 1,"IV"=>4,"V"=>5,"IX"=>9,"X"=>10,"L"=>50,"XC"=>90,"C"=>100,"D"=>500,"CM"=> 900,"M"=>1000}

def solution(number)
  ans = []
  HASH.to_a.reverse.to_h.each do |k,v|
    while number/v > 0
      ans << k
      number -= v
    end
  end
  p ans.join
end
