// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

/**
주제: [Adoption 고도화 시키기]
내용: [지난 시간 사용했던 Adoption을 배운 Solidity 내용을 응용하여 고도화 시킬 예정]
- 기존 Adoption은  반려동물 추가 불가, 승인과정 없음 등의 문제가 있었음. 
- 다음 Task를 활용하는 과제 진행. (문제 해결!) - 

[과제 해결 조건]
- 컴파일이 되어야함
- 요구한 Task가 존재해야함.

[과제 제출 메일]
- 2sujin@ksbpartners.co.kr 
- 너무 어려워서 다 완성을 못하더라도, 한 부분까지라도 제출 바랍니다 

[필요한 함수 및 변수는 자유롭게 생성 가능]

Task1. Pet 구조체를 생성하여라 
       구조체는 다음과 같은 형식을 가진다
       string name(이름), string breed(종), uint8 age(나이), string location(지역)  
Task2. pets를 동적인 배열로 구성하고, 사용자로부터 입력을 받을 수 있도록 구성해라
Task3. (registerPet)사용자로부터 입력받아 pet를 추가하고, 현재 주인은 pet정보를 입력한 사용자로 저장해라
Task4. (createAdopt)분양을 공고 할 수 있는 함수를 만들고 펫 주인만 호출 가능하게 작성하여라
Task5. (applyAdoption)다른 사용자가 입양 신청을 할 수 있게 만들어라
Task6. (apprveAdoption)원 주인이 apply한 사용자를 승인하는 함수를 만들어라 해당 함수가 호출되면 (소유권?)은 이전된다. 
 */

contract Adoption {
    // state: adopters;
    address[16] public adopters;

    constructor() public {}

    // function: adopt
    function adopt(uint256 _petId) public returns (uint256) {
        require(_petId >= 0 && _petId <= 15);

        adopters[_petId] = msg.sender;
        return _petId;
    }

    // function: getAdopters
    function getAdopters() external view returns (address[16] memory) {
        return adopters;
    }
}
