package hrms.hrms;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hrms.hrms.entity.City;
import hrms.hrms.repository.CityDao;

public class CityRepositoryTest {

	@Autowired
	private CityDao cityDao;

	@Test
	void whenCitySaved_thenCanBeFoundById() {
		City city = new City();
		city.setCityName("Istanbul");

		City saved = cityDao.save(city);
		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getCityName()).isEqualTo("Istanbul");

	}

	@Test
	void whenCityNonExist_thenReturnsEmpty() {
		Optional<City> result = cityDao.findById(999);
		assertThat(result).isEmpty();

	}

	@Test
	void whenDuplicateCityName_thenThhrowsException() {
		City city1 = new City();
		city1.setCityName("Ankara");
		cityDao.save(city1);

		City city2 = new City();
		city2.setCityName("Ankara");

		assertThatThrownBy(() -> cityDao.saveAndFlush(city2)).isInstanceOf(Exception.class);
	}
}
